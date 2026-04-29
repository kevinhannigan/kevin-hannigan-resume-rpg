import { ChapterId, CHAPTERS } from '../constants';
import type { SaveData, BuckyForm } from '../types';

const STORAGE_KEY = 'kevin_resume_game';

const defaultSave = (): SaveData => ({
  currentChapter: 'uw_campus',
  currentMap: 'uw_campus_exterior',
  flags: {},
  badges: [],
  processDex: [],
  tumiItems: [],
  playTime: 0,
  buckyForm: 'badger',
  sharePrice: 0,
});

class ProgressManager {
  private data: SaveData;
  private startTime: number;

  constructor() {
    this.data = defaultSave();
    this.startTime = Date.now();
  }

  load(): SaveData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.data = { ...defaultSave(), ...JSON.parse(raw) };
      }
    } catch {
      this.data = defaultSave();
    }
    this.startTime = Date.now();
    return this.data;
  }

  save() {
    this.data.playTime += Date.now() - this.startTime;
    this.startTime = Date.now();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch { /* storage full or unavailable */ }
  }

  reset() {
    this.data = defaultSave();
    this.startTime = Date.now();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { /* noop */ }
  }

  getFlag(key: string): boolean {
    return !!this.data.flags[key];
  }

  setFlag(key: string, value = true) {
    this.data.flags[key] = value;
    this.save();
  }

  hasAllFlags(flags: string[]): boolean {
    return flags.every((f) => this.data.flags[f]);
  }

  addBadge(badge: string) {
    if (!this.data.badges.includes(badge)) {
      this.data.badges.push(badge);
      this.save();
    }
  }

  hasBadge(badge: string): boolean {
    return this.data.badges.includes(badge);
  }

  getBadges(): string[] {
    return [...this.data.badges];
  }

  addProcessDexEntry(id: string) {
    if (!this.data.processDex.includes(id)) {
      this.data.processDex.push(id);
      this.save();
    }
  }

  getProcessDex(): string[] {
    return [...this.data.processDex];
  }

  addTumiItem(item: string) {
    if (!this.data.tumiItems.includes(item)) {
      this.data.tumiItems.push(item);
      this.save();
    }
  }

  getTumiItems(): string[] {
    return [...this.data.tumiItems];
  }

  setCurrentChapter(chapter: ChapterId) {
    this.data.currentChapter = chapter;
    this.save();
  }

  getCurrentChapter(): ChapterId {
    return this.data.currentChapter;
  }

  setCurrentMap(map: string) {
    this.data.currentMap = map;
    this.save();
  }

  getCurrentMap(): string {
    return this.data.currentMap;
  }

  getChapterIndex(): number {
    return CHAPTERS.indexOf(this.data.currentChapter);
  }

  isChapterUnlocked(chapter: ChapterId): boolean {
    const idx = CHAPTERS.indexOf(chapter);
    const current = this.getChapterIndex();
    return idx <= current;
  }

  getBuckyForm(): BuckyForm {
    const form = this.data.buckyForm || 'badger';
    if (form === 'product_manager') {
      const hasDt = this.hasAllFlags([
        'enc_dt_meta_done', 'enc_dt_cloudflare_done', 'enc_dt_revenue_done',
      ]);
      if (!hasDt) {
        const hasIv = this.hasAllFlags(['encounter_communication_done', 'encounter_enterprise_done']);
        return hasIv ? 'consultant' : 'badger';
      }
      return 'product_manager';
    }
    if (form === 'consultant') {
      const hasIv = this.hasAllFlags(['encounter_communication_done', 'encounter_enterprise_done']);
      if (!hasIv) return 'badger';
    }
    return form;
  }

  setBuckyForm(form: BuckyForm) {
    this.data.buckyForm = form;
    this.save();
  }

  getSharePrice(): number {
    return this.data.sharePrice;
  }

  setSharePrice(amount: number) {
    this.data.sharePrice = Math.max(0, amount);
    this.save();
  }

  addSharePrice(amount: number) {
    this.data.sharePrice = Math.max(0, this.data.sharePrice + amount);
    this.save();
  }

  getData(): SaveData {
    return { ...this.data };
  }
}

export const progressManager = new ProgressManager();
