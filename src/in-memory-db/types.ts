export type Key = string;
export type Value = number;
export type Count = number;

export type ValueStore = Record<Key, Value | null>;
export type ValueCount = Record<Value, Count>;
