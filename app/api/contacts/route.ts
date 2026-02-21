import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { contact } from '@/lib/db/schema';
import { getUserByAddress } from '@/lib/db/queries';

/** Generate unique ID */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * GET /api/contacts
 * List all contacts for the authenticated user
 */
export async function GET(request: Request) {
  try {
    const walletAddress = request.headers.get('x-wallet-address');

    if (!walletAddress) {
      return NextResponse.json({ contacts: [] });
    }

    const userRecord = await getUserByAddress(walletAddress);

    if (!userRecord) {
      return NextResponse.json({ contacts: [] });
    }

    const contacts = await db
      .select()
      .from(contact)
      .where(eq(contact.userId, userRecord.id))
      .orderBy(contact.name);

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('[Contacts API] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contacts
 * Create a new contact
 */
export async function POST(request: Request) {
  try {
    const walletAddress = request.headers.get('x-wallet-address');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 401 }
      );
    }

    const userRecord = await getUserByAddress(walletAddress);

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, evmAddress, btcAddress } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!evmAddress && !btcAddress) {
      return NextResponse.json(
        { error: 'At least one address (EVM or BTC) is required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const newContact = {
      id: generateId(),
      userId: userRecord.id,
      name: name.trim(),
      evmAddress: evmAddress || null,
      btcAddress: btcAddress || null,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(contact).values(newContact);

    return NextResponse.json({ contact: newContact }, { status: 201 });
  } catch (error) {
    console.error('[Contacts API] POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/contacts
 * Update an existing contact
 */
export async function PUT(request: Request) {
  try {
    const walletAddress = request.headers.get('x-wallet-address');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 401 }
      );
    }

    const userRecord = await getUserByAddress(walletAddress);

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { id, name, evmAddress, btcAddress } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    // Verify contact belongs to user
    const existing = await db
      .select()
      .from(contact)
      .where(and(eq(contact.id, id), eq(contact.userId, userRecord.id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updates.name = name.trim();
    if (evmAddress !== undefined) updates.evmAddress = evmAddress || null;
    if (btcAddress !== undefined) updates.btcAddress = btcAddress || null;

    await db.update(contact).set(updates).where(eq(contact.id, id));

    const updated = await db
      .select()
      .from(contact)
      .where(eq(contact.id, id))
      .limit(1);

    return NextResponse.json({ contact: updated[0] });
  } catch (error) {
    console.error('[Contacts API] PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/contacts
 * Delete a contact
 */
export async function DELETE(request: Request) {
  try {
    const walletAddress = request.headers.get('x-wallet-address');

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 401 }
      );
    }

    const userRecord = await getUserByAddress(walletAddress);

    if (!userRecord) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    // Verify contact belongs to user
    const existing = await db
      .select()
      .from(contact)
      .where(and(eq(contact.id, id), eq(contact.userId, userRecord.id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }

    await db.delete(contact).where(eq(contact.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Contacts API] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
