import { getOrCreateUserByAddress } from '@/lib/db/queries';

export const maxDuration = 10;

/**
 * Register or get existing user by wallet address.
 * Called automatically when wallet connects.
 */
export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address || typeof address !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Address is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await getOrCreateUserByAddress(address);

    return Response.json({
      success: true,
      user: {
        id: user.id,
        address: user.address,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[User Register] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to register user' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
