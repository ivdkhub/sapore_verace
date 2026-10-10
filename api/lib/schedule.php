<?php
// Orari di apertura, ferie e fasce orarie prenotabili (stessa logica del frontend).

declare(strict_types=1);

const SV_DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function time_to_minutes(string $hhmm): ?int
{
    if (!preg_match('/^([01]\d|2[0-3]):([0-5]\d)$/', $hhmm, $m)) return null;
    return (int)$m[1] * 60 + (int)$m[2];
}

function minutes_to_time(int $minutes): string
{
    return sprintf('%02d:%02d', intdiv($minutes, 60) % 24, $minutes % 60);
}

function holiday_for_date(string $date): ?array
{
    foreach ((array)kv_get('holidays', []) as $h) {
        if (!is_array($h)) continue;
        if ($date >= ($h['startDate'] ?? '9999') && $date <= ($h['endDate'] ?? '0000')) return $h;
    }
    return null;
}

function day_config_for_date(string $date): ?array
{
    $hours = (array)kv_get('opening_hours', []);
    $dayKey = SV_DAY_KEYS[(int)date('w', strtotime($date . ' 12:00:00'))];
    return isset($hours[$dayKey]) && is_array($hours[$dayKey]) ? $hours[$dayKey] : null;
}

// Restituisce ['open' => bool, 'reason' => string, 'hours' => ['open'=>'12:00','close'=>'14:30']]
function shift_status(string $date, string $shift): array
{
    $holiday = holiday_for_date($date);
    if ($holiday) {
        return ['open' => false, 'reason' => 'Chiuso per ' . ($holiday['name'] ?? 'chiusura programmata') . '.'];
    }
    $day = day_config_for_date($date);
    if (!$day || !empty($day['closed'])) {
        return ['open' => false, 'reason' => (($day['label'] ?? 'Questo giorno')) . ' è il giorno di chiusura settimanale.'];
    }
    $key = $shift === 'pranzo' ? 'lunch' : 'dinner';
    $hours = $day[$key] ?? null;
    if (!is_array($hours) || empty($hours['enabled'])) {
        return ['open' => false, 'reason' => 'Il ' . ($day['label'] ?? 'giorno scelto') . ' siamo chiusi a ' . ($shift === 'pranzo' ? 'pranzo' : 'cena') . '.'];
    }
    return ['open' => true, 'reason' => '', 'hours' => $hours];
}

// Fasce prenotabili per data e turno (da apertura a chiusura - N minuti)
function booking_slots(string $date, string $shift): array
{
    $status = shift_status($date, $shift);
    if (!$status['open']) return [];
    $open = time_to_minutes((string)($status['hours']['open'] ?? ''));
    $close = time_to_minutes((string)($status['hours']['close'] ?? ''));
    if ($open === null || $close === null) return [];
    if ($close <= $open) $close += 24 * 60; // chiusura dopo mezzanotte

    $step = max(15, (int)cfg('reservations.slot_minutes', 30));
    $last = $close - max(0, (int)cfg('reservations.last_slot_before_close', 30));
    $slots = [];
    for ($m = $open; $m <= $last; $m += $step) $slots[] = minutes_to_time($m);
    return $slots;
}

// Minuti dall'inizio della giornata di oggi (ora italiana)
function now_minutes(): int
{
    return (int)date('G') * 60 + (int)date('i');
}

// Minuti di un orario del turno contati dalla mezzanotte del giorno del turno:
// per un turno che chiude dopo mezzanotte (es. 19:00-00:30) "00:00" vale 1440, non 0.
function shift_minutes(string $date, string $shift, string $hhmm): ?int
{
    $t = time_to_minutes($hhmm);
    if ($t === null) return null;
    $status = shift_status($date, $shift);
    $open = $status['open'] ? time_to_minutes((string)($status['hours']['open'] ?? '')) : null;
    return ($open !== null && $t < $open) ? $t + 1440 : $t;
}

// Turni da considerare "adesso": quelli di oggi e quello di ieri se chiude dopo mezzanotte.
// Ogni voce: ['date', 'shift', 'open', 'close'] in minuti dalla mezzanotte di OGGI.
function current_shift_windows(): array
{
    $out = [];
    foreach ([-1, 0] as $dayOffset) {
        $date = date('Y-m-d', strtotime(($dayOffset < 0 ? '-1' : '+0') . ' day'));
        foreach (['pranzo', 'cena'] as $shift) {
            $s = shift_status($date, $shift);
            if (!$s['open']) continue;
            $open = time_to_minutes((string)($s['hours']['open'] ?? ''));
            $close = time_to_minutes((string)($s['hours']['close'] ?? ''));
            if ($open === null || $close === null) continue;
            if ($close <= $open) $close += 1440;
            $open += $dayOffset * 1440;
            $close += $dayOffset * 1440;
            if ($close <= 0) continue; // turno di ieri già finito
            $out[] = ['date' => $date, 'shift' => $shift, 'open' => $open, 'close' => $close];
        }
    }
    return $out;
}
