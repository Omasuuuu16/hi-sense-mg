/** Parse laptop specs string into structured fields. */

export interface ParsedSpecs {
    cpu: string;
    ram: string;
    ssd: string;
    display: string;
}

export function parseSpecs(specs: string, model?: string): ParsedSpecs {
    const text = specs || model || '';

    const cpu =
        matchFirst(text, [
            /(?:Ci|Core\s*i|i)[3579][\s-]?(?:\d+(?:th|nd|rd|st)?[A-Z]?|[-\w]+)/i,
            /Ryzen\s*\d+[\s-]?\d*(?:th)?/i,
            /AMD\s+[\w-]+/i,
        ]) || '';

    const ram =
        matchFirst(text, [
            /Ram\s*(\d+)\s*gb/i,
            /(\d+)\s*gb\s*(?:ddr\d|ram)/i,
            /(\d+)\s*GB\s*RAM/i,
        ], true) || '';

    const ssd =
        matchFirst(text, [
            /SSD\s*(\d+)\s*(gb|tb)/i,
            /(\d+)\s*(gb|tb)\s*(?:nvme|ssd)/i,
            /NVMe\s*(\d+)\s*(gb|tb)/i,
        ], true) || '';

    const display =
        matchFirst(text, [
            /(\d+(?:\.\d+)?)\s*["″]?\s*(?:FHD|HD|UHD|4K|Touch[^,]*)/i,
            /(\d+(?:\.\d+)?)\s*inch/i,
        ], true) || '';

    return {
        cpu: normalizeCpu(cpu),
        ram: normalizeRam(ram),
        ssd: normalizeSsd(ssd),
        display: normalizeDisplay(display),
    };
}

function matchFirst(text: string, patterns: RegExp[], withGroups = false): string {
    for (const pattern of patterns) {
        const m = text.match(pattern);
        if (!m) continue;
        if (withGroups && m.length > 1) {
            return m.slice(1).filter(Boolean).join(' ').trim();
        }
        return m[0].trim();
    }
    return '';
}

function normalizeCpu(raw: string): string {
    if (!raw) return '';
    return raw
        .replace(/^Ci/i, 'Ci')
        .replace(/core\s*i(\d)/i, 'i$1')
        .trim();
}

function normalizeRam(raw: string): string {
    if (!raw) return '';
    const m = raw.match(/(\d+)/);
    return m ? `${m[1]}GB` : raw;
}

function normalizeSsd(raw: string): string {
    if (!raw) return '';
    const m = raw.match(/(\d+)\s*(gb|tb)/i);
    if (!m) return raw;
    return `${m[1]}${m[2].toUpperCase()}`;
}

function normalizeDisplay(raw: string): string {
    if (!raw) return '';
    const m = raw.match(/(\d+(?:\.\d+)?)/);
    if (!m) return raw;
    const size = m[1];
    const hasFhd = /fhd/i.test(raw);
    const hasTouch = /touch/i.test(raw);
    let result = `${size}"`;
    if (hasFhd) result += ' FHD';
    if (hasTouch) result += ' Touch';
    return result.trim();
}

/** Slug for generated image filenames: "HP EliteBook 830 G8" → "hp830g8" */
export function modelToSlug(model: string): string {
    const brand = model.split(' ')[0]?.toLowerCase() || 'device';
    const numbers = model.match(/\d+/g)?.join('') || '';
    const series = model.match(/(?:elitebook|latitude|thinkpad|probook|inspiron|optiplex)\s*(\w+)/i)?.[1]?.toLowerCase() || '';
    const suffix = numbers || series || model.replace(/[^a-z0-9]/gi, '').slice(0, 8).toLowerCase();
    return `${brand}${suffix}`.replace(/[^a-z0-9]/g, '');
}
