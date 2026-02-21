'use client';

import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import type { Contact } from '@/lib/db/schema';

/** Contact for voice mode (simplified) */
export interface VoiceContact {
  id: string;
  name: string;
  evmAddress?: string;
  btcAddress?: string;
}

/** Fetcher with wallet address header */
async function fetchWithWallet(url: string): Promise<{ contacts: Contact[] }> {
  const walletAddress = localStorage.getItem('walletAddress');

  const res = await fetch(url, {
    headers: walletAddress
      ? { 'x-wallet-address': walletAddress }
      : {},
  });

  if (!res.ok) {
    throw new Error('Failed to fetch contacts');
  }

  return res.json();
}

/**
 * Hook for managing contacts
 * Uses SWR for caching and revalidation
 */
export function useContacts() {
  const { data, error, mutate, isLoading } = useSWR(
    '/api/contacts',
    fetchWithWallet,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000,
    }
  );

  const contacts = useMemo(() => data?.contacts ?? [], [data]);

  /** Add a new contact */
  const addContact = useCallback(
    async (name: string, evmAddress?: string, btcAddress?: string) => {
      const walletAddress = localStorage.getItem('walletAddress');

      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(walletAddress ? { 'x-wallet-address': walletAddress } : {}),
        },
        body: JSON.stringify({ name, evmAddress, btcAddress }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create contact');
      }

      const result = await res.json();

      // Optimistically update cache
      mutate(
        (current) => ({
          contacts: [...(current?.contacts ?? []), result.contact],
        }),
        false
      );

      return result.contact;
    },
    [mutate]
  );

  /** Update an existing contact */
  const updateContact = useCallback(
    async (
      id: string,
      updates: { name?: string; evmAddress?: string; btcAddress?: string }
    ) => {
      const walletAddress = localStorage.getItem('walletAddress');

      const res = await fetch('/api/contacts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(walletAddress ? { 'x-wallet-address': walletAddress } : {}),
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update contact');
      }

      const result = await res.json();

      // Optimistically update cache
      mutate(
        (current) => ({
          contacts:
            current?.contacts.map((c: Contact) =>
              c.id === id ? result.contact : c
            ) ?? [],
        }),
        false
      );

      return result.contact;
    },
    [mutate]
  );

  /** Delete a contact */
  const deleteContact = useCallback(
    async (id: string) => {
      const walletAddress = localStorage.getItem('walletAddress');

      const res = await fetch(`/api/contacts?id=${id}`, {
        method: 'DELETE',
        headers: walletAddress ? { 'x-wallet-address': walletAddress } : {},
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete contact');
      }

      // Optimistically update cache
      mutate(
        (current) => ({
          contacts: current?.contacts.filter((c: Contact) => c.id !== id) ?? [],
        }),
        false
      );

      return true;
    },
    [mutate]
  );

  /** Resolve a name to address (for voice mode) */
  const resolveNameToAddress = useCallback(
    (name: string): { evmAddress?: string; btcAddress?: string } | null => {
      const normalizedName = name.toLowerCase().trim();
      const found = contacts.find(
        (c) => c.name.toLowerCase() === normalizedName
      );

      if (!found) return null;

      return {
        evmAddress: found.evmAddress ?? undefined,
        btcAddress: found.btcAddress ?? undefined,
      };
    },
    [contacts]
  );

  /** Get contacts formatted for voice mode */
  const voiceContacts: VoiceContact[] = useMemo(
    () =>
      contacts.map((c) => ({
        id: c.id,
        name: c.name,
        evmAddress: c.evmAddress ?? undefined,
        btcAddress: c.btcAddress ?? undefined,
      })),
    [contacts]
  );

  return {
    contacts,
    voiceContacts,
    isLoading,
    error,
    addContact,
    updateContact,
    deleteContact,
    resolveNameToAddress,
    refresh: mutate,
  };
}
