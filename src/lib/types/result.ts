/**
 * Result型 - 成功/失敗を型で表現するユーティリティ
 * Rust風のResult<T, E>パターン
 */

export type Result<T, E = Error> = Ok<T> | Err<E>;

export type Ok<T> = {
  ok: true;
  value: T;
};

export type Err<E = Error> = {
  ok: false;
  error: E;
};

/**
 * 成功値を返す
 */
export function ok<T>(value: T): Ok<T> {
  return { ok: true, value };
}

/**
 * エラーを返す
 */
export function err<E = Error>(error: E): Err<E> {
  return { ok: false, error };
}

/**
 * Result型が成功かどうかを判定
 */
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.ok === true;
}

/**
 * Result型が失敗かどうかを判定
 */
export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result.ok === false;
}
