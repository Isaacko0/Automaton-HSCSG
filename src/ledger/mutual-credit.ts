// src/ledger/mutual-credit.ts
// Automaton-HSCSG — RIDF Mutual Credit Ledger (asimilado desde red-de-intercambio-federada-isaacko)
// Perspectiva AXIOLÓGICA: VALORAR — contabilidad multilateral/bilateral, trustlines, límites

import type { ToolContext } from '../agent/types.js';
import { ulid } from 'ulid';

/* ═════════════════════════════════════════════════════════════════
   TIPOS — Mutual Credit (Trustlines, Bilateral/Global Pools)
   ═════════════════════════════════════════════════════════════════ */

export type TxType = 
  | 'internal'
  | 'cross_node'
  | 'tax'
  | 'fund_distribution'
  | 'salary'
  | 'debt_liberation'
  | 'limit_increase'
  | 'sponsor_debt';

export type EntryType = 'debit' | 'credit';

export type AccountCategory = 
  | 'user_balance'
  | 'node_bridge'
  | 'node_bridge_global'
  | 'node_bridge_bilateral'
  | 'fund'
  | 'external_bridge';

export type PoolType = 'global' | 'bilateral';

export interface Transaction {
  id: string;
  txType: TxType;
  senderId?: string;
  receiverId?: string;
  senderNode: string;
  receiverNode: string;
  amount: bigint;
  taxAmount: bigint;
  taxTargetAccount?: string;
  userSignature: string;
  nodeSignature: string;
  prevHash: string;
  currentHash: string;
  externalId: string;
  status: string;
  metadata: Record<string, any>;
  createdAt: Date;
  confirmedAt?: Date;
}

export interface LedgerEntry {
  id: bigint;
  transactionId: string;
  accountId: string;
  entryType: EntryType;
  amount: bigint;
  balanceAfter: bigint;
  category: AccountCategory;
  poolType: PoolType;
  counterpartyNode?: string;
  createdAt: Date;
}

export interface Trustline {
  id: string;
  creditorId: string;
  debtorId: string;
  creditorNode: string;
  debtorNode: string;
  limit: bigint;
  used: bigint;
  currency: string; // 'ZNU' | 'FRNE' | 'EUR' | etc.
  status: 'active' | 'frozen' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface NodeLevel {
  nodeDomain: string;
  level: number; // 0=satélite, 1=local, 2=regional, 3=global
  maxGlobalLimit: bigint;
  maxBilateralLimit: bigint;
  sponsorshipRequired: boolean;
  sponsorNode?: string;
  updatedAt: Date;
}

export interface BilateralLimit {
  id: string;
  nodeA: string;
  nodeB: string;
  limitAtoB: bigint;
  limitBtoA: bigint;
  usedAtoB: bigint;
  usedBtoA: bigint;
  status: 'active' | 'suspended';
  updatedAt: Date;
}

/* ═════════════════════════════════════════════════════════════════
   HASH CHAIN — Integridad inmutable (Ley II: forma)
   ═════════════════════════════════════════════════════════════════ */

export class HashChain {
  private lastHash = '0'.repeat(64);

  computeHash(data: string): string {
    // Simplified SHA-256 for TypeScript (use crypto.subtle in browser, node:crypto in Node)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(64, '0');
  }

  nextHash(tx: Omit<Transaction, 'currentHash' | 'prevHash'>): { prevHash: string; currentHash: string } {
    const prevHash = this.lastHash;
    const data = `${tx.id}${tx.senderId}${tx.receiverId}${tx.amount}${tx.txType}${prevHash}`;
    const currentHash = this.computeHash(data);
    this.lastHash = currentHash;
    return { prevHash, currentHash };
  }

  verifyChain(transactions: Transaction[]): boolean {
    let expectedHash = '0'.repeat(64);
    
    for (const tx of transactions) {
      if (tx.prevHash !== expectedHash) return false;
      
      const data = `${tx.id}${tx.senderId}${tx.receiverId}${tx.amount}${tx.txType}${expectedHash}`;
      const computedHash = this.computeHash(data);
      
      if (tx.currentHash !== computedHash) return false;
      expectedHash = tx.currentHash;
    }
    
    return true;
  }

  reset(): void {
    this.lastHash = '0'.repeat(64);
  }
}

/* ═════════════════════════════════════════════════════════════════
   MUTUAL CREDIT ENGINE — Trustlines + Bilateral/Global Pools
   ═════════════════════════════════════════════════════════════════ */

export interface MutualCreditConfig {
  nodeDomain: string;
  defaultCurrency: string;
  hashChain: HashChain;
}

export class MutualCreditEngine {
  private trustlines = new Map<string, Trustline>();
  private bilateralLimits = new Map<string, BilateralLimit>();
  private nodeLevels = new Map<string, NodeLevel>();
  private transactions: Transaction[] = [];
  private ledgerEntries: LedgerEntry[] = [];

  constructor(private config: MutualCreditConfig) {}

  /* ────────────────────────────────────────────────────────────────
     TRUSTLINES (Crédito mutuo bilateral)
     ──────────────────────────────────────────────────────────────── */

  async createTrustline(params: {
    creditorId: string;
    debtorId: string;
    creditorNode: string;
    debtorNode: string;
    limit: bigint;
    currency: string;
  }): Promise<Trustline> {
    const id = ulid();
    const now = new Date();
    
    const trustline: Trustline = {
      id,
      creditorId: params.creditorId,
      debtorId: params.debtorId,
      creditorNode: params.creditorNode,
      debtorNode: params.debtorNode,
      limit: params.limit,
      used: 0n,
      currency: params.currency,
      status: 'active',
      createdAt: now,
      updatedAt: now
    };

    this.trustlines.set(id, trustline);
    return trustline;
  }

  async getTrustline(id: string): Promise<Trustline | undefined> {
    return this.trustlines.get(id);
  }

  async getTrustlinesForUser(userId: string): Promise<Trustline[]> {
    return Array.from(this.trustlines.values()).filter(
      t => t.creditorId === userId || t.debtorId === userId
    );
  }

  async updateTrustlineUsage(
    trustlineId: string,
    amount: bigint,
    isCredit: boolean
  ): Promise<void> {
    const tl = this.trustlines.get(trustlineId);
    if (!tl) throw new Error('Trustline not found');

    if (isCredit) {
      tl.used += amount;
    } else {
      tl.used -= amount;
    }
    
    tl.used = tl.used < 0n ? 0n : tl.used;
    tl.updatedAt = new Date();
  }

  async checkTrustlineCapacity(trustlineId: string, amount: bigint): Promise<boolean> {
    const tl = this.trustlines.get(trustlineId);
    if (!tl || tl.status !== 'active') return false;
    return tl.used + amount <= tl.limit;
  }

  /* ────────────────────────────────────────────────────────────────
     BILATERAL LIMITS (Límites entre nodos)
     ──────────────────────────────────────────────────────────────── */

  async setBilateralLimit(params: {
    nodeA: string;
    nodeB: string;
    limitAtoB: bigint;
    limitBtoA: bigint;
  }): Promise<BilateralLimit> {
    const key = [params.nodeA, params.nodeB].sort().join(':');
    const id = ulid();
    const now = new Date();

    const limit: BilateralLimit = {
      id,
      nodeA: params.nodeA,
      nodeB: params.nodeB,
      limitAtoB: params.limitAtoB,
      limitBtoA: params.limitBtoA,
      usedAtoB: 0n,
      usedBtoA: 0n,
      status: 'active',
      updatedAt: now
    };

    this.bilateralLimits.set(key, limit);
    return limit;
  }

  async getBilateralLimit(nodeA: string, nodeB: string): Promise<BilateralLimit | undefined> {
    const key = [nodeA, nodeB].sort().join(':');
    return this.bilateralLimits.get(key);
  }

  async useBilateralLimit(
    fromNode: string,
    toNode: string,
    amount: bigint
  ): Promise<boolean> {
    const key = [fromNode, toNode].sort().join(':');
    const limit = this.bilateralLimits.get(key);
    if (!limit || limit.status !== 'active') return false;

    const isAtoB = limit.nodeA === fromNode;
    const used = isAtoB ? limit.usedAtoB : limit.usedBtoA;
    const maxLimit = isAtoB ? limit.limitAtoB : limit.limitBtoA;

    if (used + amount > maxLimit) return false;

    if (isAtoB) {
      limit.usedAtoB += amount;
    } else {
      limit.usedBtoA += amount;
    }
    
    limit.updatedAt = new Date();
    return true;
  }

  /* ────────────────────────────────────────────────────────────────
     NODE LEVELS (Niveles de nodo — capacidad global)
     ──────────────────────────────────────────────────────────────── */

  async setNodeLevel(level: NodeLevel): Promise<void> {
    this.nodeLevels.set(level.nodeDomain, level);
  }

  async getNodeLevel(nodeDomain: string): Promise<NodeLevel | undefined> {
    return this.nodeLevels.get(nodeDomain);
  }

  async canNodeTransactGlobal(nodeDomain: string, amount: bigint): Promise<boolean> {
    const level = this.nodeLevels.get(nodeDomain);
    if (!level) return false;
    
    // Verificar límites globales usados vs máximos
    const globalUsed = this.getGlobalUsedForNode(nodeDomain);
    return globalUsed + amount <= level.maxGlobalLimit;
  }

  private getGlobalUsedForNode(nodeDomain: string): bigint {
    return this.transactions
      .filter(t => t.senderNode === nodeDomain && t.txType === 'cross_node')
      .reduce((sum, t) => sum + t.amount, 0n);
  }

  /* ────────────────────────────────────────────────────────────────
     TRANSACTIONS — Registro inmutable con hash chain
     ──────────────────────────────────────────────────────────────── */

  async recordTransaction(
    tx: Omit<Transaction, 'id' | 'prevHash' | 'currentHash' | 'createdAt'>
  ): Promise<Transaction> {
    const id = ulid();
    const now = new Date();
    
    const { prevHash, currentHash } = this.config.hashChain.nextHash({ ...tx, id });
    
    const transaction: Transaction = {
      ...tx,
      id,
      prevHash,
      currentHash,
      createdAt: now
    };

    this.transactions.push(transaction);
    await this.createLedgerEntries(transaction);
    
    return transaction;
  }

  private async createLedgerEntries(tx: Transaction): Promise<void> {
    // Entrada débito para sender
    this.ledgerEntries.push({
      id: BigInt(this.ledgerEntries.length + 1),
      transactionId: tx.id,
      accountId: tx.senderId || 'system',
      entryType: 'debit',
      amount: tx.amount,
      balanceAfter: 0n, // Calculado en query real
      category: 'user_balance',
      poolType: tx.senderNode === tx.receiverNode ? 'global' : 'bilateral',
      counterpartyNode: tx.receiverNode,
      createdAt: tx.createdAt
    });

    // Entrada crédito para receiver
    this.ledgerEntries.push({
      id: BigInt(this.ledgerEntries.length + 1),
      transactionId: tx.id,
      accountId: tx.receiverId || 'system',
      entryType: 'credit',
      amount: tx.amount,
      balanceAfter: 0n,
      category: 'user_balance',
      poolType: tx.senderNode === tx.receiverNode ? 'global' : 'bilateral',
      counterpartyNode: tx.senderNode,
      createdAt: tx.createdAt
    });
  }

  async getBalance(userId: string, nodeDomain: string): Promise<bigint> {
    const entries = this.ledgerEntries.filter(
      e => e.accountId === userId && e.counterpartyNode === nodeDomain
    );
    
    return entries.reduce((sum, e) => {
      return e.entryType === 'credit' ? sum + e.amount : sum - e.amount;
    }, 0n);
  }

  async getTransactionHistory(userId: string, limit = 100): Promise<Transaction[]> {
    return this.transactions
      .filter(t => t.senderId === userId || t.receiverId === userId)
      .slice(-limit);
  }

  /* ────────────────────────────────────────────────────────────────
     VERIFICACIÓN DE INTEGRIDAD
     ──────────────────────────────────────────────────────────────── */

  verifyIntegrity(): boolean {
    return this.config.hashChain.verifyChain(this.transactions);
  }

  /* ────────────────────────────────────────────────────────────────
     EXPORT
     ──────────────────────────────────────────────────────────────── */

  static create(config: MutualCreditConfig): MutualCreditEngine {
    return new MutualCreditEngine(config);
  }
}

export default MutualCreditEngine;