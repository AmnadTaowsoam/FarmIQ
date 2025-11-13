
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model MediaObject
 * 
 */
export type MediaObject = $Result.DefaultSelection<Prisma.$MediaObjectPayload>
/**
 * Model ReadingMediaMap
 * 
 */
export type ReadingMediaMap = $Result.DefaultSelection<Prisma.$ReadingMediaMapPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more MediaObjects
 * const mediaObjects = await prisma.mediaObject.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more MediaObjects
   * const mediaObjects = await prisma.mediaObject.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.mediaObject`: Exposes CRUD operations for the **MediaObject** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MediaObjects
    * const mediaObjects = await prisma.mediaObject.findMany()
    * ```
    */
  get mediaObject(): Prisma.MediaObjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.readingMediaMap`: Exposes CRUD operations for the **ReadingMediaMap** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReadingMediaMaps
    * const readingMediaMaps = await prisma.readingMediaMap.findMany()
    * ```
    */
  get readingMediaMap(): Prisma.ReadingMediaMapDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.2
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    MediaObject: 'MediaObject',
    ReadingMediaMap: 'ReadingMediaMap'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "mediaObject" | "readingMediaMap"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      MediaObject: {
        payload: Prisma.$MediaObjectPayload<ExtArgs>
        fields: Prisma.MediaObjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MediaObjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaObjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MediaObjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaObjectPayload>
          }
          findFirst: {
            args: Prisma.MediaObjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaObjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MediaObjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaObjectPayload>
          }
          findMany: {
            args: Prisma.MediaObjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaObjectPayload>[]
          }
          create: {
            args: Prisma.MediaObjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaObjectPayload>
          }
          createMany: {
            args: Prisma.MediaObjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MediaObjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaObjectPayload>[]
          }
          delete: {
            args: Prisma.MediaObjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaObjectPayload>
          }
          update: {
            args: Prisma.MediaObjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaObjectPayload>
          }
          deleteMany: {
            args: Prisma.MediaObjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MediaObjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MediaObjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaObjectPayload>[]
          }
          upsert: {
            args: Prisma.MediaObjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MediaObjectPayload>
          }
          aggregate: {
            args: Prisma.MediaObjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMediaObject>
          }
          groupBy: {
            args: Prisma.MediaObjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<MediaObjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.MediaObjectCountArgs<ExtArgs>
            result: $Utils.Optional<MediaObjectCountAggregateOutputType> | number
          }
        }
      }
      ReadingMediaMap: {
        payload: Prisma.$ReadingMediaMapPayload<ExtArgs>
        fields: Prisma.ReadingMediaMapFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReadingMediaMapFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingMediaMapPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReadingMediaMapFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingMediaMapPayload>
          }
          findFirst: {
            args: Prisma.ReadingMediaMapFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingMediaMapPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReadingMediaMapFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingMediaMapPayload>
          }
          findMany: {
            args: Prisma.ReadingMediaMapFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingMediaMapPayload>[]
          }
          create: {
            args: Prisma.ReadingMediaMapCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingMediaMapPayload>
          }
          createMany: {
            args: Prisma.ReadingMediaMapCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReadingMediaMapCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingMediaMapPayload>[]
          }
          delete: {
            args: Prisma.ReadingMediaMapDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingMediaMapPayload>
          }
          update: {
            args: Prisma.ReadingMediaMapUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingMediaMapPayload>
          }
          deleteMany: {
            args: Prisma.ReadingMediaMapDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReadingMediaMapUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReadingMediaMapUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingMediaMapPayload>[]
          }
          upsert: {
            args: Prisma.ReadingMediaMapUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReadingMediaMapPayload>
          }
          aggregate: {
            args: Prisma.ReadingMediaMapAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReadingMediaMap>
          }
          groupBy: {
            args: Prisma.ReadingMediaMapGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReadingMediaMapGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReadingMediaMapCountArgs<ExtArgs>
            result: $Utils.Optional<ReadingMediaMapCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    mediaObject?: MediaObjectOmit
    readingMediaMap?: ReadingMediaMapOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model MediaObject
   */

  export type AggregateMediaObject = {
    _count: MediaObjectCountAggregateOutputType | null
    _avg: MediaObjectAvgAggregateOutputType | null
    _sum: MediaObjectSumAggregateOutputType | null
    _min: MediaObjectMinAggregateOutputType | null
    _max: MediaObjectMaxAggregateOutputType | null
  }

  export type MediaObjectAvgAggregateOutputType = {
    fileSize: number | null
    width: number | null
    height: number | null
  }

  export type MediaObjectSumAggregateOutputType = {
    fileSize: bigint | null
    width: number | null
    height: number | null
  }

  export type MediaObjectMinAggregateOutputType = {
    id: string | null
    mediaId: string | null
    tenantId: string | null
    farmId: string | null
    houseId: string | null
    stationId: string | null
    sensorId: string | null
    bucket: string | null
    objectKey: string | null
    fileName: string | null
    fileSize: bigint | null
    mimeType: string | null
    sha256: string | null
    width: number | null
    height: number | null
    time: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MediaObjectMaxAggregateOutputType = {
    id: string | null
    mediaId: string | null
    tenantId: string | null
    farmId: string | null
    houseId: string | null
    stationId: string | null
    sensorId: string | null
    bucket: string | null
    objectKey: string | null
    fileName: string | null
    fileSize: bigint | null
    mimeType: string | null
    sha256: string | null
    width: number | null
    height: number | null
    time: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MediaObjectCountAggregateOutputType = {
    id: number
    mediaId: number
    tenantId: number
    farmId: number
    houseId: number
    stationId: number
    sensorId: number
    bucket: number
    objectKey: number
    fileName: number
    fileSize: number
    mimeType: number
    sha256: number
    width: number
    height: number
    metadata: number
    time: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MediaObjectAvgAggregateInputType = {
    fileSize?: true
    width?: true
    height?: true
  }

  export type MediaObjectSumAggregateInputType = {
    fileSize?: true
    width?: true
    height?: true
  }

  export type MediaObjectMinAggregateInputType = {
    id?: true
    mediaId?: true
    tenantId?: true
    farmId?: true
    houseId?: true
    stationId?: true
    sensorId?: true
    bucket?: true
    objectKey?: true
    fileName?: true
    fileSize?: true
    mimeType?: true
    sha256?: true
    width?: true
    height?: true
    time?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MediaObjectMaxAggregateInputType = {
    id?: true
    mediaId?: true
    tenantId?: true
    farmId?: true
    houseId?: true
    stationId?: true
    sensorId?: true
    bucket?: true
    objectKey?: true
    fileName?: true
    fileSize?: true
    mimeType?: true
    sha256?: true
    width?: true
    height?: true
    time?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MediaObjectCountAggregateInputType = {
    id?: true
    mediaId?: true
    tenantId?: true
    farmId?: true
    houseId?: true
    stationId?: true
    sensorId?: true
    bucket?: true
    objectKey?: true
    fileName?: true
    fileSize?: true
    mimeType?: true
    sha256?: true
    width?: true
    height?: true
    metadata?: true
    time?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MediaObjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MediaObject to aggregate.
     */
    where?: MediaObjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaObjects to fetch.
     */
    orderBy?: MediaObjectOrderByWithRelationInput | MediaObjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MediaObjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaObjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaObjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MediaObjects
    **/
    _count?: true | MediaObjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MediaObjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MediaObjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MediaObjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MediaObjectMaxAggregateInputType
  }

  export type GetMediaObjectAggregateType<T extends MediaObjectAggregateArgs> = {
        [P in keyof T & keyof AggregateMediaObject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMediaObject[P]>
      : GetScalarType<T[P], AggregateMediaObject[P]>
  }




  export type MediaObjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MediaObjectWhereInput
    orderBy?: MediaObjectOrderByWithAggregationInput | MediaObjectOrderByWithAggregationInput[]
    by: MediaObjectScalarFieldEnum[] | MediaObjectScalarFieldEnum
    having?: MediaObjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MediaObjectCountAggregateInputType | true
    _avg?: MediaObjectAvgAggregateInputType
    _sum?: MediaObjectSumAggregateInputType
    _min?: MediaObjectMinAggregateInputType
    _max?: MediaObjectMaxAggregateInputType
  }

  export type MediaObjectGroupByOutputType = {
    id: string
    mediaId: string
    tenantId: string
    farmId: string | null
    houseId: string | null
    stationId: string | null
    sensorId: string | null
    bucket: string
    objectKey: string
    fileName: string
    fileSize: bigint
    mimeType: string
    sha256: string
    width: number | null
    height: number | null
    metadata: JsonValue | null
    time: Date
    createdAt: Date
    updatedAt: Date
    _count: MediaObjectCountAggregateOutputType | null
    _avg: MediaObjectAvgAggregateOutputType | null
    _sum: MediaObjectSumAggregateOutputType | null
    _min: MediaObjectMinAggregateOutputType | null
    _max: MediaObjectMaxAggregateOutputType | null
  }

  type GetMediaObjectGroupByPayload<T extends MediaObjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MediaObjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MediaObjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MediaObjectGroupByOutputType[P]>
            : GetScalarType<T[P], MediaObjectGroupByOutputType[P]>
        }
      >
    >


  export type MediaObjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mediaId?: boolean
    tenantId?: boolean
    farmId?: boolean
    houseId?: boolean
    stationId?: boolean
    sensorId?: boolean
    bucket?: boolean
    objectKey?: boolean
    fileName?: boolean
    fileSize?: boolean
    mimeType?: boolean
    sha256?: boolean
    width?: boolean
    height?: boolean
    metadata?: boolean
    time?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mediaObject"]>

  export type MediaObjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mediaId?: boolean
    tenantId?: boolean
    farmId?: boolean
    houseId?: boolean
    stationId?: boolean
    sensorId?: boolean
    bucket?: boolean
    objectKey?: boolean
    fileName?: boolean
    fileSize?: boolean
    mimeType?: boolean
    sha256?: boolean
    width?: boolean
    height?: boolean
    metadata?: boolean
    time?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mediaObject"]>

  export type MediaObjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mediaId?: boolean
    tenantId?: boolean
    farmId?: boolean
    houseId?: boolean
    stationId?: boolean
    sensorId?: boolean
    bucket?: boolean
    objectKey?: boolean
    fileName?: boolean
    fileSize?: boolean
    mimeType?: boolean
    sha256?: boolean
    width?: boolean
    height?: boolean
    metadata?: boolean
    time?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["mediaObject"]>

  export type MediaObjectSelectScalar = {
    id?: boolean
    mediaId?: boolean
    tenantId?: boolean
    farmId?: boolean
    houseId?: boolean
    stationId?: boolean
    sensorId?: boolean
    bucket?: boolean
    objectKey?: boolean
    fileName?: boolean
    fileSize?: boolean
    mimeType?: boolean
    sha256?: boolean
    width?: boolean
    height?: boolean
    metadata?: boolean
    time?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MediaObjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "mediaId" | "tenantId" | "farmId" | "houseId" | "stationId" | "sensorId" | "bucket" | "objectKey" | "fileName" | "fileSize" | "mimeType" | "sha256" | "width" | "height" | "metadata" | "time" | "createdAt" | "updatedAt", ExtArgs["result"]["mediaObject"]>

  export type $MediaObjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MediaObject"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      mediaId: string
      tenantId: string
      farmId: string | null
      houseId: string | null
      stationId: string | null
      sensorId: string | null
      bucket: string
      objectKey: string
      fileName: string
      fileSize: bigint
      mimeType: string
      sha256: string
      width: number | null
      height: number | null
      metadata: Prisma.JsonValue | null
      time: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["mediaObject"]>
    composites: {}
  }

  type MediaObjectGetPayload<S extends boolean | null | undefined | MediaObjectDefaultArgs> = $Result.GetResult<Prisma.$MediaObjectPayload, S>

  type MediaObjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MediaObjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MediaObjectCountAggregateInputType | true
    }

  export interface MediaObjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MediaObject'], meta: { name: 'MediaObject' } }
    /**
     * Find zero or one MediaObject that matches the filter.
     * @param {MediaObjectFindUniqueArgs} args - Arguments to find a MediaObject
     * @example
     * // Get one MediaObject
     * const mediaObject = await prisma.mediaObject.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MediaObjectFindUniqueArgs>(args: SelectSubset<T, MediaObjectFindUniqueArgs<ExtArgs>>): Prisma__MediaObjectClient<$Result.GetResult<Prisma.$MediaObjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MediaObject that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MediaObjectFindUniqueOrThrowArgs} args - Arguments to find a MediaObject
     * @example
     * // Get one MediaObject
     * const mediaObject = await prisma.mediaObject.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MediaObjectFindUniqueOrThrowArgs>(args: SelectSubset<T, MediaObjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MediaObjectClient<$Result.GetResult<Prisma.$MediaObjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MediaObject that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaObjectFindFirstArgs} args - Arguments to find a MediaObject
     * @example
     * // Get one MediaObject
     * const mediaObject = await prisma.mediaObject.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MediaObjectFindFirstArgs>(args?: SelectSubset<T, MediaObjectFindFirstArgs<ExtArgs>>): Prisma__MediaObjectClient<$Result.GetResult<Prisma.$MediaObjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MediaObject that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaObjectFindFirstOrThrowArgs} args - Arguments to find a MediaObject
     * @example
     * // Get one MediaObject
     * const mediaObject = await prisma.mediaObject.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MediaObjectFindFirstOrThrowArgs>(args?: SelectSubset<T, MediaObjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__MediaObjectClient<$Result.GetResult<Prisma.$MediaObjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MediaObjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaObjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MediaObjects
     * const mediaObjects = await prisma.mediaObject.findMany()
     * 
     * // Get first 10 MediaObjects
     * const mediaObjects = await prisma.mediaObject.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const mediaObjectWithIdOnly = await prisma.mediaObject.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MediaObjectFindManyArgs>(args?: SelectSubset<T, MediaObjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaObjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MediaObject.
     * @param {MediaObjectCreateArgs} args - Arguments to create a MediaObject.
     * @example
     * // Create one MediaObject
     * const MediaObject = await prisma.mediaObject.create({
     *   data: {
     *     // ... data to create a MediaObject
     *   }
     * })
     * 
     */
    create<T extends MediaObjectCreateArgs>(args: SelectSubset<T, MediaObjectCreateArgs<ExtArgs>>): Prisma__MediaObjectClient<$Result.GetResult<Prisma.$MediaObjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MediaObjects.
     * @param {MediaObjectCreateManyArgs} args - Arguments to create many MediaObjects.
     * @example
     * // Create many MediaObjects
     * const mediaObject = await prisma.mediaObject.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MediaObjectCreateManyArgs>(args?: SelectSubset<T, MediaObjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MediaObjects and returns the data saved in the database.
     * @param {MediaObjectCreateManyAndReturnArgs} args - Arguments to create many MediaObjects.
     * @example
     * // Create many MediaObjects
     * const mediaObject = await prisma.mediaObject.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MediaObjects and only return the `id`
     * const mediaObjectWithIdOnly = await prisma.mediaObject.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MediaObjectCreateManyAndReturnArgs>(args?: SelectSubset<T, MediaObjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaObjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MediaObject.
     * @param {MediaObjectDeleteArgs} args - Arguments to delete one MediaObject.
     * @example
     * // Delete one MediaObject
     * const MediaObject = await prisma.mediaObject.delete({
     *   where: {
     *     // ... filter to delete one MediaObject
     *   }
     * })
     * 
     */
    delete<T extends MediaObjectDeleteArgs>(args: SelectSubset<T, MediaObjectDeleteArgs<ExtArgs>>): Prisma__MediaObjectClient<$Result.GetResult<Prisma.$MediaObjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MediaObject.
     * @param {MediaObjectUpdateArgs} args - Arguments to update one MediaObject.
     * @example
     * // Update one MediaObject
     * const mediaObject = await prisma.mediaObject.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MediaObjectUpdateArgs>(args: SelectSubset<T, MediaObjectUpdateArgs<ExtArgs>>): Prisma__MediaObjectClient<$Result.GetResult<Prisma.$MediaObjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MediaObjects.
     * @param {MediaObjectDeleteManyArgs} args - Arguments to filter MediaObjects to delete.
     * @example
     * // Delete a few MediaObjects
     * const { count } = await prisma.mediaObject.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MediaObjectDeleteManyArgs>(args?: SelectSubset<T, MediaObjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MediaObjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaObjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MediaObjects
     * const mediaObject = await prisma.mediaObject.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MediaObjectUpdateManyArgs>(args: SelectSubset<T, MediaObjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MediaObjects and returns the data updated in the database.
     * @param {MediaObjectUpdateManyAndReturnArgs} args - Arguments to update many MediaObjects.
     * @example
     * // Update many MediaObjects
     * const mediaObject = await prisma.mediaObject.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MediaObjects and only return the `id`
     * const mediaObjectWithIdOnly = await prisma.mediaObject.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MediaObjectUpdateManyAndReturnArgs>(args: SelectSubset<T, MediaObjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MediaObjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MediaObject.
     * @param {MediaObjectUpsertArgs} args - Arguments to update or create a MediaObject.
     * @example
     * // Update or create a MediaObject
     * const mediaObject = await prisma.mediaObject.upsert({
     *   create: {
     *     // ... data to create a MediaObject
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MediaObject we want to update
     *   }
     * })
     */
    upsert<T extends MediaObjectUpsertArgs>(args: SelectSubset<T, MediaObjectUpsertArgs<ExtArgs>>): Prisma__MediaObjectClient<$Result.GetResult<Prisma.$MediaObjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MediaObjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaObjectCountArgs} args - Arguments to filter MediaObjects to count.
     * @example
     * // Count the number of MediaObjects
     * const count = await prisma.mediaObject.count({
     *   where: {
     *     // ... the filter for the MediaObjects we want to count
     *   }
     * })
    **/
    count<T extends MediaObjectCountArgs>(
      args?: Subset<T, MediaObjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MediaObjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MediaObject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaObjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MediaObjectAggregateArgs>(args: Subset<T, MediaObjectAggregateArgs>): Prisma.PrismaPromise<GetMediaObjectAggregateType<T>>

    /**
     * Group by MediaObject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MediaObjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MediaObjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MediaObjectGroupByArgs['orderBy'] }
        : { orderBy?: MediaObjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MediaObjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMediaObjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MediaObject model
   */
  readonly fields: MediaObjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MediaObject.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MediaObjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MediaObject model
   */
  interface MediaObjectFieldRefs {
    readonly id: FieldRef<"MediaObject", 'String'>
    readonly mediaId: FieldRef<"MediaObject", 'String'>
    readonly tenantId: FieldRef<"MediaObject", 'String'>
    readonly farmId: FieldRef<"MediaObject", 'String'>
    readonly houseId: FieldRef<"MediaObject", 'String'>
    readonly stationId: FieldRef<"MediaObject", 'String'>
    readonly sensorId: FieldRef<"MediaObject", 'String'>
    readonly bucket: FieldRef<"MediaObject", 'String'>
    readonly objectKey: FieldRef<"MediaObject", 'String'>
    readonly fileName: FieldRef<"MediaObject", 'String'>
    readonly fileSize: FieldRef<"MediaObject", 'BigInt'>
    readonly mimeType: FieldRef<"MediaObject", 'String'>
    readonly sha256: FieldRef<"MediaObject", 'String'>
    readonly width: FieldRef<"MediaObject", 'Int'>
    readonly height: FieldRef<"MediaObject", 'Int'>
    readonly metadata: FieldRef<"MediaObject", 'Json'>
    readonly time: FieldRef<"MediaObject", 'DateTime'>
    readonly createdAt: FieldRef<"MediaObject", 'DateTime'>
    readonly updatedAt: FieldRef<"MediaObject", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MediaObject findUnique
   */
  export type MediaObjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaObject
     */
    select?: MediaObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaObject
     */
    omit?: MediaObjectOmit<ExtArgs> | null
    /**
     * Filter, which MediaObject to fetch.
     */
    where: MediaObjectWhereUniqueInput
  }

  /**
   * MediaObject findUniqueOrThrow
   */
  export type MediaObjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaObject
     */
    select?: MediaObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaObject
     */
    omit?: MediaObjectOmit<ExtArgs> | null
    /**
     * Filter, which MediaObject to fetch.
     */
    where: MediaObjectWhereUniqueInput
  }

  /**
   * MediaObject findFirst
   */
  export type MediaObjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaObject
     */
    select?: MediaObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaObject
     */
    omit?: MediaObjectOmit<ExtArgs> | null
    /**
     * Filter, which MediaObject to fetch.
     */
    where?: MediaObjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaObjects to fetch.
     */
    orderBy?: MediaObjectOrderByWithRelationInput | MediaObjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MediaObjects.
     */
    cursor?: MediaObjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaObjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaObjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MediaObjects.
     */
    distinct?: MediaObjectScalarFieldEnum | MediaObjectScalarFieldEnum[]
  }

  /**
   * MediaObject findFirstOrThrow
   */
  export type MediaObjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaObject
     */
    select?: MediaObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaObject
     */
    omit?: MediaObjectOmit<ExtArgs> | null
    /**
     * Filter, which MediaObject to fetch.
     */
    where?: MediaObjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaObjects to fetch.
     */
    orderBy?: MediaObjectOrderByWithRelationInput | MediaObjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MediaObjects.
     */
    cursor?: MediaObjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaObjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaObjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MediaObjects.
     */
    distinct?: MediaObjectScalarFieldEnum | MediaObjectScalarFieldEnum[]
  }

  /**
   * MediaObject findMany
   */
  export type MediaObjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaObject
     */
    select?: MediaObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaObject
     */
    omit?: MediaObjectOmit<ExtArgs> | null
    /**
     * Filter, which MediaObjects to fetch.
     */
    where?: MediaObjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MediaObjects to fetch.
     */
    orderBy?: MediaObjectOrderByWithRelationInput | MediaObjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MediaObjects.
     */
    cursor?: MediaObjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MediaObjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MediaObjects.
     */
    skip?: number
    distinct?: MediaObjectScalarFieldEnum | MediaObjectScalarFieldEnum[]
  }

  /**
   * MediaObject create
   */
  export type MediaObjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaObject
     */
    select?: MediaObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaObject
     */
    omit?: MediaObjectOmit<ExtArgs> | null
    /**
     * The data needed to create a MediaObject.
     */
    data: XOR<MediaObjectCreateInput, MediaObjectUncheckedCreateInput>
  }

  /**
   * MediaObject createMany
   */
  export type MediaObjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MediaObjects.
     */
    data: MediaObjectCreateManyInput | MediaObjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MediaObject createManyAndReturn
   */
  export type MediaObjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaObject
     */
    select?: MediaObjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MediaObject
     */
    omit?: MediaObjectOmit<ExtArgs> | null
    /**
     * The data used to create many MediaObjects.
     */
    data: MediaObjectCreateManyInput | MediaObjectCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MediaObject update
   */
  export type MediaObjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaObject
     */
    select?: MediaObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaObject
     */
    omit?: MediaObjectOmit<ExtArgs> | null
    /**
     * The data needed to update a MediaObject.
     */
    data: XOR<MediaObjectUpdateInput, MediaObjectUncheckedUpdateInput>
    /**
     * Choose, which MediaObject to update.
     */
    where: MediaObjectWhereUniqueInput
  }

  /**
   * MediaObject updateMany
   */
  export type MediaObjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MediaObjects.
     */
    data: XOR<MediaObjectUpdateManyMutationInput, MediaObjectUncheckedUpdateManyInput>
    /**
     * Filter which MediaObjects to update
     */
    where?: MediaObjectWhereInput
    /**
     * Limit how many MediaObjects to update.
     */
    limit?: number
  }

  /**
   * MediaObject updateManyAndReturn
   */
  export type MediaObjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaObject
     */
    select?: MediaObjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MediaObject
     */
    omit?: MediaObjectOmit<ExtArgs> | null
    /**
     * The data used to update MediaObjects.
     */
    data: XOR<MediaObjectUpdateManyMutationInput, MediaObjectUncheckedUpdateManyInput>
    /**
     * Filter which MediaObjects to update
     */
    where?: MediaObjectWhereInput
    /**
     * Limit how many MediaObjects to update.
     */
    limit?: number
  }

  /**
   * MediaObject upsert
   */
  export type MediaObjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaObject
     */
    select?: MediaObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaObject
     */
    omit?: MediaObjectOmit<ExtArgs> | null
    /**
     * The filter to search for the MediaObject to update in case it exists.
     */
    where: MediaObjectWhereUniqueInput
    /**
     * In case the MediaObject found by the `where` argument doesn't exist, create a new MediaObject with this data.
     */
    create: XOR<MediaObjectCreateInput, MediaObjectUncheckedCreateInput>
    /**
     * In case the MediaObject was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MediaObjectUpdateInput, MediaObjectUncheckedUpdateInput>
  }

  /**
   * MediaObject delete
   */
  export type MediaObjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaObject
     */
    select?: MediaObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaObject
     */
    omit?: MediaObjectOmit<ExtArgs> | null
    /**
     * Filter which MediaObject to delete.
     */
    where: MediaObjectWhereUniqueInput
  }

  /**
   * MediaObject deleteMany
   */
  export type MediaObjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MediaObjects to delete
     */
    where?: MediaObjectWhereInput
    /**
     * Limit how many MediaObjects to delete.
     */
    limit?: number
  }

  /**
   * MediaObject without action
   */
  export type MediaObjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MediaObject
     */
    select?: MediaObjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MediaObject
     */
    omit?: MediaObjectOmit<ExtArgs> | null
  }


  /**
   * Model ReadingMediaMap
   */

  export type AggregateReadingMediaMap = {
    _count: ReadingMediaMapCountAggregateOutputType | null
    _avg: ReadingMediaMapAvgAggregateOutputType | null
    _sum: ReadingMediaMapSumAggregateOutputType | null
    _min: ReadingMediaMapMinAggregateOutputType | null
    _max: ReadingMediaMapMaxAggregateOutputType | null
  }

  export type ReadingMediaMapAvgAggregateOutputType = {
    deltaMs: number | null
    confidence: number | null
  }

  export type ReadingMediaMapSumAggregateOutputType = {
    deltaMs: number | null
    confidence: number | null
  }

  export type ReadingMediaMapMinAggregateOutputType = {
    id: string | null
    mediaId: string | null
    readingId: string | null
    deltaMs: number | null
    strategy: string | null
    confidence: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReadingMediaMapMaxAggregateOutputType = {
    id: string | null
    mediaId: string | null
    readingId: string | null
    deltaMs: number | null
    strategy: string | null
    confidence: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReadingMediaMapCountAggregateOutputType = {
    id: number
    mediaId: number
    readingId: number
    deltaMs: number
    strategy: number
    confidence: number
    metadata: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReadingMediaMapAvgAggregateInputType = {
    deltaMs?: true
    confidence?: true
  }

  export type ReadingMediaMapSumAggregateInputType = {
    deltaMs?: true
    confidence?: true
  }

  export type ReadingMediaMapMinAggregateInputType = {
    id?: true
    mediaId?: true
    readingId?: true
    deltaMs?: true
    strategy?: true
    confidence?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReadingMediaMapMaxAggregateInputType = {
    id?: true
    mediaId?: true
    readingId?: true
    deltaMs?: true
    strategy?: true
    confidence?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReadingMediaMapCountAggregateInputType = {
    id?: true
    mediaId?: true
    readingId?: true
    deltaMs?: true
    strategy?: true
    confidence?: true
    metadata?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReadingMediaMapAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReadingMediaMap to aggregate.
     */
    where?: ReadingMediaMapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingMediaMaps to fetch.
     */
    orderBy?: ReadingMediaMapOrderByWithRelationInput | ReadingMediaMapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReadingMediaMapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingMediaMaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingMediaMaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReadingMediaMaps
    **/
    _count?: true | ReadingMediaMapCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReadingMediaMapAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReadingMediaMapSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReadingMediaMapMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReadingMediaMapMaxAggregateInputType
  }

  export type GetReadingMediaMapAggregateType<T extends ReadingMediaMapAggregateArgs> = {
        [P in keyof T & keyof AggregateReadingMediaMap]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReadingMediaMap[P]>
      : GetScalarType<T[P], AggregateReadingMediaMap[P]>
  }




  export type ReadingMediaMapGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReadingMediaMapWhereInput
    orderBy?: ReadingMediaMapOrderByWithAggregationInput | ReadingMediaMapOrderByWithAggregationInput[]
    by: ReadingMediaMapScalarFieldEnum[] | ReadingMediaMapScalarFieldEnum
    having?: ReadingMediaMapScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReadingMediaMapCountAggregateInputType | true
    _avg?: ReadingMediaMapAvgAggregateInputType
    _sum?: ReadingMediaMapSumAggregateInputType
    _min?: ReadingMediaMapMinAggregateInputType
    _max?: ReadingMediaMapMaxAggregateInputType
  }

  export type ReadingMediaMapGroupByOutputType = {
    id: string
    mediaId: string
    readingId: string
    deltaMs: number
    strategy: string
    confidence: number | null
    metadata: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: ReadingMediaMapCountAggregateOutputType | null
    _avg: ReadingMediaMapAvgAggregateOutputType | null
    _sum: ReadingMediaMapSumAggregateOutputType | null
    _min: ReadingMediaMapMinAggregateOutputType | null
    _max: ReadingMediaMapMaxAggregateOutputType | null
  }

  type GetReadingMediaMapGroupByPayload<T extends ReadingMediaMapGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReadingMediaMapGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReadingMediaMapGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReadingMediaMapGroupByOutputType[P]>
            : GetScalarType<T[P], ReadingMediaMapGroupByOutputType[P]>
        }
      >
    >


  export type ReadingMediaMapSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mediaId?: boolean
    readingId?: boolean
    deltaMs?: boolean
    strategy?: boolean
    confidence?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["readingMediaMap"]>

  export type ReadingMediaMapSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mediaId?: boolean
    readingId?: boolean
    deltaMs?: boolean
    strategy?: boolean
    confidence?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["readingMediaMap"]>

  export type ReadingMediaMapSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    mediaId?: boolean
    readingId?: boolean
    deltaMs?: boolean
    strategy?: boolean
    confidence?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["readingMediaMap"]>

  export type ReadingMediaMapSelectScalar = {
    id?: boolean
    mediaId?: boolean
    readingId?: boolean
    deltaMs?: boolean
    strategy?: boolean
    confidence?: boolean
    metadata?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReadingMediaMapOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "mediaId" | "readingId" | "deltaMs" | "strategy" | "confidence" | "metadata" | "createdAt" | "updatedAt", ExtArgs["result"]["readingMediaMap"]>

  export type $ReadingMediaMapPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReadingMediaMap"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      mediaId: string
      readingId: string
      deltaMs: number
      strategy: string
      confidence: number | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["readingMediaMap"]>
    composites: {}
  }

  type ReadingMediaMapGetPayload<S extends boolean | null | undefined | ReadingMediaMapDefaultArgs> = $Result.GetResult<Prisma.$ReadingMediaMapPayload, S>

  type ReadingMediaMapCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReadingMediaMapFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReadingMediaMapCountAggregateInputType | true
    }

  export interface ReadingMediaMapDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReadingMediaMap'], meta: { name: 'ReadingMediaMap' } }
    /**
     * Find zero or one ReadingMediaMap that matches the filter.
     * @param {ReadingMediaMapFindUniqueArgs} args - Arguments to find a ReadingMediaMap
     * @example
     * // Get one ReadingMediaMap
     * const readingMediaMap = await prisma.readingMediaMap.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReadingMediaMapFindUniqueArgs>(args: SelectSubset<T, ReadingMediaMapFindUniqueArgs<ExtArgs>>): Prisma__ReadingMediaMapClient<$Result.GetResult<Prisma.$ReadingMediaMapPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ReadingMediaMap that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReadingMediaMapFindUniqueOrThrowArgs} args - Arguments to find a ReadingMediaMap
     * @example
     * // Get one ReadingMediaMap
     * const readingMediaMap = await prisma.readingMediaMap.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReadingMediaMapFindUniqueOrThrowArgs>(args: SelectSubset<T, ReadingMediaMapFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReadingMediaMapClient<$Result.GetResult<Prisma.$ReadingMediaMapPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReadingMediaMap that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingMediaMapFindFirstArgs} args - Arguments to find a ReadingMediaMap
     * @example
     * // Get one ReadingMediaMap
     * const readingMediaMap = await prisma.readingMediaMap.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReadingMediaMapFindFirstArgs>(args?: SelectSubset<T, ReadingMediaMapFindFirstArgs<ExtArgs>>): Prisma__ReadingMediaMapClient<$Result.GetResult<Prisma.$ReadingMediaMapPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReadingMediaMap that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingMediaMapFindFirstOrThrowArgs} args - Arguments to find a ReadingMediaMap
     * @example
     * // Get one ReadingMediaMap
     * const readingMediaMap = await prisma.readingMediaMap.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReadingMediaMapFindFirstOrThrowArgs>(args?: SelectSubset<T, ReadingMediaMapFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReadingMediaMapClient<$Result.GetResult<Prisma.$ReadingMediaMapPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ReadingMediaMaps that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingMediaMapFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReadingMediaMaps
     * const readingMediaMaps = await prisma.readingMediaMap.findMany()
     * 
     * // Get first 10 ReadingMediaMaps
     * const readingMediaMaps = await prisma.readingMediaMap.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const readingMediaMapWithIdOnly = await prisma.readingMediaMap.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReadingMediaMapFindManyArgs>(args?: SelectSubset<T, ReadingMediaMapFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingMediaMapPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ReadingMediaMap.
     * @param {ReadingMediaMapCreateArgs} args - Arguments to create a ReadingMediaMap.
     * @example
     * // Create one ReadingMediaMap
     * const ReadingMediaMap = await prisma.readingMediaMap.create({
     *   data: {
     *     // ... data to create a ReadingMediaMap
     *   }
     * })
     * 
     */
    create<T extends ReadingMediaMapCreateArgs>(args: SelectSubset<T, ReadingMediaMapCreateArgs<ExtArgs>>): Prisma__ReadingMediaMapClient<$Result.GetResult<Prisma.$ReadingMediaMapPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ReadingMediaMaps.
     * @param {ReadingMediaMapCreateManyArgs} args - Arguments to create many ReadingMediaMaps.
     * @example
     * // Create many ReadingMediaMaps
     * const readingMediaMap = await prisma.readingMediaMap.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReadingMediaMapCreateManyArgs>(args?: SelectSubset<T, ReadingMediaMapCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReadingMediaMaps and returns the data saved in the database.
     * @param {ReadingMediaMapCreateManyAndReturnArgs} args - Arguments to create many ReadingMediaMaps.
     * @example
     * // Create many ReadingMediaMaps
     * const readingMediaMap = await prisma.readingMediaMap.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReadingMediaMaps and only return the `id`
     * const readingMediaMapWithIdOnly = await prisma.readingMediaMap.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReadingMediaMapCreateManyAndReturnArgs>(args?: SelectSubset<T, ReadingMediaMapCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingMediaMapPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ReadingMediaMap.
     * @param {ReadingMediaMapDeleteArgs} args - Arguments to delete one ReadingMediaMap.
     * @example
     * // Delete one ReadingMediaMap
     * const ReadingMediaMap = await prisma.readingMediaMap.delete({
     *   where: {
     *     // ... filter to delete one ReadingMediaMap
     *   }
     * })
     * 
     */
    delete<T extends ReadingMediaMapDeleteArgs>(args: SelectSubset<T, ReadingMediaMapDeleteArgs<ExtArgs>>): Prisma__ReadingMediaMapClient<$Result.GetResult<Prisma.$ReadingMediaMapPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ReadingMediaMap.
     * @param {ReadingMediaMapUpdateArgs} args - Arguments to update one ReadingMediaMap.
     * @example
     * // Update one ReadingMediaMap
     * const readingMediaMap = await prisma.readingMediaMap.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReadingMediaMapUpdateArgs>(args: SelectSubset<T, ReadingMediaMapUpdateArgs<ExtArgs>>): Prisma__ReadingMediaMapClient<$Result.GetResult<Prisma.$ReadingMediaMapPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ReadingMediaMaps.
     * @param {ReadingMediaMapDeleteManyArgs} args - Arguments to filter ReadingMediaMaps to delete.
     * @example
     * // Delete a few ReadingMediaMaps
     * const { count } = await prisma.readingMediaMap.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReadingMediaMapDeleteManyArgs>(args?: SelectSubset<T, ReadingMediaMapDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReadingMediaMaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingMediaMapUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReadingMediaMaps
     * const readingMediaMap = await prisma.readingMediaMap.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReadingMediaMapUpdateManyArgs>(args: SelectSubset<T, ReadingMediaMapUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReadingMediaMaps and returns the data updated in the database.
     * @param {ReadingMediaMapUpdateManyAndReturnArgs} args - Arguments to update many ReadingMediaMaps.
     * @example
     * // Update many ReadingMediaMaps
     * const readingMediaMap = await prisma.readingMediaMap.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ReadingMediaMaps and only return the `id`
     * const readingMediaMapWithIdOnly = await prisma.readingMediaMap.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ReadingMediaMapUpdateManyAndReturnArgs>(args: SelectSubset<T, ReadingMediaMapUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReadingMediaMapPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ReadingMediaMap.
     * @param {ReadingMediaMapUpsertArgs} args - Arguments to update or create a ReadingMediaMap.
     * @example
     * // Update or create a ReadingMediaMap
     * const readingMediaMap = await prisma.readingMediaMap.upsert({
     *   create: {
     *     // ... data to create a ReadingMediaMap
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReadingMediaMap we want to update
     *   }
     * })
     */
    upsert<T extends ReadingMediaMapUpsertArgs>(args: SelectSubset<T, ReadingMediaMapUpsertArgs<ExtArgs>>): Prisma__ReadingMediaMapClient<$Result.GetResult<Prisma.$ReadingMediaMapPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ReadingMediaMaps.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingMediaMapCountArgs} args - Arguments to filter ReadingMediaMaps to count.
     * @example
     * // Count the number of ReadingMediaMaps
     * const count = await prisma.readingMediaMap.count({
     *   where: {
     *     // ... the filter for the ReadingMediaMaps we want to count
     *   }
     * })
    **/
    count<T extends ReadingMediaMapCountArgs>(
      args?: Subset<T, ReadingMediaMapCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReadingMediaMapCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReadingMediaMap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingMediaMapAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ReadingMediaMapAggregateArgs>(args: Subset<T, ReadingMediaMapAggregateArgs>): Prisma.PrismaPromise<GetReadingMediaMapAggregateType<T>>

    /**
     * Group by ReadingMediaMap.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReadingMediaMapGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ReadingMediaMapGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReadingMediaMapGroupByArgs['orderBy'] }
        : { orderBy?: ReadingMediaMapGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ReadingMediaMapGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReadingMediaMapGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReadingMediaMap model
   */
  readonly fields: ReadingMediaMapFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReadingMediaMap.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReadingMediaMapClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ReadingMediaMap model
   */
  interface ReadingMediaMapFieldRefs {
    readonly id: FieldRef<"ReadingMediaMap", 'String'>
    readonly mediaId: FieldRef<"ReadingMediaMap", 'String'>
    readonly readingId: FieldRef<"ReadingMediaMap", 'String'>
    readonly deltaMs: FieldRef<"ReadingMediaMap", 'Int'>
    readonly strategy: FieldRef<"ReadingMediaMap", 'String'>
    readonly confidence: FieldRef<"ReadingMediaMap", 'Float'>
    readonly metadata: FieldRef<"ReadingMediaMap", 'Json'>
    readonly createdAt: FieldRef<"ReadingMediaMap", 'DateTime'>
    readonly updatedAt: FieldRef<"ReadingMediaMap", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReadingMediaMap findUnique
   */
  export type ReadingMediaMapFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingMediaMap
     */
    select?: ReadingMediaMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingMediaMap
     */
    omit?: ReadingMediaMapOmit<ExtArgs> | null
    /**
     * Filter, which ReadingMediaMap to fetch.
     */
    where: ReadingMediaMapWhereUniqueInput
  }

  /**
   * ReadingMediaMap findUniqueOrThrow
   */
  export type ReadingMediaMapFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingMediaMap
     */
    select?: ReadingMediaMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingMediaMap
     */
    omit?: ReadingMediaMapOmit<ExtArgs> | null
    /**
     * Filter, which ReadingMediaMap to fetch.
     */
    where: ReadingMediaMapWhereUniqueInput
  }

  /**
   * ReadingMediaMap findFirst
   */
  export type ReadingMediaMapFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingMediaMap
     */
    select?: ReadingMediaMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingMediaMap
     */
    omit?: ReadingMediaMapOmit<ExtArgs> | null
    /**
     * Filter, which ReadingMediaMap to fetch.
     */
    where?: ReadingMediaMapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingMediaMaps to fetch.
     */
    orderBy?: ReadingMediaMapOrderByWithRelationInput | ReadingMediaMapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReadingMediaMaps.
     */
    cursor?: ReadingMediaMapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingMediaMaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingMediaMaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReadingMediaMaps.
     */
    distinct?: ReadingMediaMapScalarFieldEnum | ReadingMediaMapScalarFieldEnum[]
  }

  /**
   * ReadingMediaMap findFirstOrThrow
   */
  export type ReadingMediaMapFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingMediaMap
     */
    select?: ReadingMediaMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingMediaMap
     */
    omit?: ReadingMediaMapOmit<ExtArgs> | null
    /**
     * Filter, which ReadingMediaMap to fetch.
     */
    where?: ReadingMediaMapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingMediaMaps to fetch.
     */
    orderBy?: ReadingMediaMapOrderByWithRelationInput | ReadingMediaMapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReadingMediaMaps.
     */
    cursor?: ReadingMediaMapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingMediaMaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingMediaMaps.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReadingMediaMaps.
     */
    distinct?: ReadingMediaMapScalarFieldEnum | ReadingMediaMapScalarFieldEnum[]
  }

  /**
   * ReadingMediaMap findMany
   */
  export type ReadingMediaMapFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingMediaMap
     */
    select?: ReadingMediaMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingMediaMap
     */
    omit?: ReadingMediaMapOmit<ExtArgs> | null
    /**
     * Filter, which ReadingMediaMaps to fetch.
     */
    where?: ReadingMediaMapWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReadingMediaMaps to fetch.
     */
    orderBy?: ReadingMediaMapOrderByWithRelationInput | ReadingMediaMapOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReadingMediaMaps.
     */
    cursor?: ReadingMediaMapWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReadingMediaMaps from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReadingMediaMaps.
     */
    skip?: number
    distinct?: ReadingMediaMapScalarFieldEnum | ReadingMediaMapScalarFieldEnum[]
  }

  /**
   * ReadingMediaMap create
   */
  export type ReadingMediaMapCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingMediaMap
     */
    select?: ReadingMediaMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingMediaMap
     */
    omit?: ReadingMediaMapOmit<ExtArgs> | null
    /**
     * The data needed to create a ReadingMediaMap.
     */
    data: XOR<ReadingMediaMapCreateInput, ReadingMediaMapUncheckedCreateInput>
  }

  /**
   * ReadingMediaMap createMany
   */
  export type ReadingMediaMapCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReadingMediaMaps.
     */
    data: ReadingMediaMapCreateManyInput | ReadingMediaMapCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReadingMediaMap createManyAndReturn
   */
  export type ReadingMediaMapCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingMediaMap
     */
    select?: ReadingMediaMapSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingMediaMap
     */
    omit?: ReadingMediaMapOmit<ExtArgs> | null
    /**
     * The data used to create many ReadingMediaMaps.
     */
    data: ReadingMediaMapCreateManyInput | ReadingMediaMapCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReadingMediaMap update
   */
  export type ReadingMediaMapUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingMediaMap
     */
    select?: ReadingMediaMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingMediaMap
     */
    omit?: ReadingMediaMapOmit<ExtArgs> | null
    /**
     * The data needed to update a ReadingMediaMap.
     */
    data: XOR<ReadingMediaMapUpdateInput, ReadingMediaMapUncheckedUpdateInput>
    /**
     * Choose, which ReadingMediaMap to update.
     */
    where: ReadingMediaMapWhereUniqueInput
  }

  /**
   * ReadingMediaMap updateMany
   */
  export type ReadingMediaMapUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReadingMediaMaps.
     */
    data: XOR<ReadingMediaMapUpdateManyMutationInput, ReadingMediaMapUncheckedUpdateManyInput>
    /**
     * Filter which ReadingMediaMaps to update
     */
    where?: ReadingMediaMapWhereInput
    /**
     * Limit how many ReadingMediaMaps to update.
     */
    limit?: number
  }

  /**
   * ReadingMediaMap updateManyAndReturn
   */
  export type ReadingMediaMapUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingMediaMap
     */
    select?: ReadingMediaMapSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingMediaMap
     */
    omit?: ReadingMediaMapOmit<ExtArgs> | null
    /**
     * The data used to update ReadingMediaMaps.
     */
    data: XOR<ReadingMediaMapUpdateManyMutationInput, ReadingMediaMapUncheckedUpdateManyInput>
    /**
     * Filter which ReadingMediaMaps to update
     */
    where?: ReadingMediaMapWhereInput
    /**
     * Limit how many ReadingMediaMaps to update.
     */
    limit?: number
  }

  /**
   * ReadingMediaMap upsert
   */
  export type ReadingMediaMapUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingMediaMap
     */
    select?: ReadingMediaMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingMediaMap
     */
    omit?: ReadingMediaMapOmit<ExtArgs> | null
    /**
     * The filter to search for the ReadingMediaMap to update in case it exists.
     */
    where: ReadingMediaMapWhereUniqueInput
    /**
     * In case the ReadingMediaMap found by the `where` argument doesn't exist, create a new ReadingMediaMap with this data.
     */
    create: XOR<ReadingMediaMapCreateInput, ReadingMediaMapUncheckedCreateInput>
    /**
     * In case the ReadingMediaMap was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReadingMediaMapUpdateInput, ReadingMediaMapUncheckedUpdateInput>
  }

  /**
   * ReadingMediaMap delete
   */
  export type ReadingMediaMapDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingMediaMap
     */
    select?: ReadingMediaMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingMediaMap
     */
    omit?: ReadingMediaMapOmit<ExtArgs> | null
    /**
     * Filter which ReadingMediaMap to delete.
     */
    where: ReadingMediaMapWhereUniqueInput
  }

  /**
   * ReadingMediaMap deleteMany
   */
  export type ReadingMediaMapDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReadingMediaMaps to delete
     */
    where?: ReadingMediaMapWhereInput
    /**
     * Limit how many ReadingMediaMaps to delete.
     */
    limit?: number
  }

  /**
   * ReadingMediaMap without action
   */
  export type ReadingMediaMapDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReadingMediaMap
     */
    select?: ReadingMediaMapSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReadingMediaMap
     */
    omit?: ReadingMediaMapOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const MediaObjectScalarFieldEnum: {
    id: 'id',
    mediaId: 'mediaId',
    tenantId: 'tenantId',
    farmId: 'farmId',
    houseId: 'houseId',
    stationId: 'stationId',
    sensorId: 'sensorId',
    bucket: 'bucket',
    objectKey: 'objectKey',
    fileName: 'fileName',
    fileSize: 'fileSize',
    mimeType: 'mimeType',
    sha256: 'sha256',
    width: 'width',
    height: 'height',
    metadata: 'metadata',
    time: 'time',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MediaObjectScalarFieldEnum = (typeof MediaObjectScalarFieldEnum)[keyof typeof MediaObjectScalarFieldEnum]


  export const ReadingMediaMapScalarFieldEnum: {
    id: 'id',
    mediaId: 'mediaId',
    readingId: 'readingId',
    deltaMs: 'deltaMs',
    strategy: 'strategy',
    confidence: 'confidence',
    metadata: 'metadata',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReadingMediaMapScalarFieldEnum = (typeof ReadingMediaMapScalarFieldEnum)[keyof typeof ReadingMediaMapScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type MediaObjectWhereInput = {
    AND?: MediaObjectWhereInput | MediaObjectWhereInput[]
    OR?: MediaObjectWhereInput[]
    NOT?: MediaObjectWhereInput | MediaObjectWhereInput[]
    id?: StringFilter<"MediaObject"> | string
    mediaId?: StringFilter<"MediaObject"> | string
    tenantId?: StringFilter<"MediaObject"> | string
    farmId?: StringNullableFilter<"MediaObject"> | string | null
    houseId?: StringNullableFilter<"MediaObject"> | string | null
    stationId?: StringNullableFilter<"MediaObject"> | string | null
    sensorId?: StringNullableFilter<"MediaObject"> | string | null
    bucket?: StringFilter<"MediaObject"> | string
    objectKey?: StringFilter<"MediaObject"> | string
    fileName?: StringFilter<"MediaObject"> | string
    fileSize?: BigIntFilter<"MediaObject"> | bigint | number
    mimeType?: StringFilter<"MediaObject"> | string
    sha256?: StringFilter<"MediaObject"> | string
    width?: IntNullableFilter<"MediaObject"> | number | null
    height?: IntNullableFilter<"MediaObject"> | number | null
    metadata?: JsonNullableFilter<"MediaObject">
    time?: DateTimeFilter<"MediaObject"> | Date | string
    createdAt?: DateTimeFilter<"MediaObject"> | Date | string
    updatedAt?: DateTimeFilter<"MediaObject"> | Date | string
  }

  export type MediaObjectOrderByWithRelationInput = {
    id?: SortOrder
    mediaId?: SortOrder
    tenantId?: SortOrder
    farmId?: SortOrderInput | SortOrder
    houseId?: SortOrderInput | SortOrder
    stationId?: SortOrderInput | SortOrder
    sensorId?: SortOrderInput | SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    sha256?: SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    time?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MediaObjectWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    mediaId?: string
    AND?: MediaObjectWhereInput | MediaObjectWhereInput[]
    OR?: MediaObjectWhereInput[]
    NOT?: MediaObjectWhereInput | MediaObjectWhereInput[]
    tenantId?: StringFilter<"MediaObject"> | string
    farmId?: StringNullableFilter<"MediaObject"> | string | null
    houseId?: StringNullableFilter<"MediaObject"> | string | null
    stationId?: StringNullableFilter<"MediaObject"> | string | null
    sensorId?: StringNullableFilter<"MediaObject"> | string | null
    bucket?: StringFilter<"MediaObject"> | string
    objectKey?: StringFilter<"MediaObject"> | string
    fileName?: StringFilter<"MediaObject"> | string
    fileSize?: BigIntFilter<"MediaObject"> | bigint | number
    mimeType?: StringFilter<"MediaObject"> | string
    sha256?: StringFilter<"MediaObject"> | string
    width?: IntNullableFilter<"MediaObject"> | number | null
    height?: IntNullableFilter<"MediaObject"> | number | null
    metadata?: JsonNullableFilter<"MediaObject">
    time?: DateTimeFilter<"MediaObject"> | Date | string
    createdAt?: DateTimeFilter<"MediaObject"> | Date | string
    updatedAt?: DateTimeFilter<"MediaObject"> | Date | string
  }, "id" | "mediaId">

  export type MediaObjectOrderByWithAggregationInput = {
    id?: SortOrder
    mediaId?: SortOrder
    tenantId?: SortOrder
    farmId?: SortOrderInput | SortOrder
    houseId?: SortOrderInput | SortOrder
    stationId?: SortOrderInput | SortOrder
    sensorId?: SortOrderInput | SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    sha256?: SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    time?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MediaObjectCountOrderByAggregateInput
    _avg?: MediaObjectAvgOrderByAggregateInput
    _max?: MediaObjectMaxOrderByAggregateInput
    _min?: MediaObjectMinOrderByAggregateInput
    _sum?: MediaObjectSumOrderByAggregateInput
  }

  export type MediaObjectScalarWhereWithAggregatesInput = {
    AND?: MediaObjectScalarWhereWithAggregatesInput | MediaObjectScalarWhereWithAggregatesInput[]
    OR?: MediaObjectScalarWhereWithAggregatesInput[]
    NOT?: MediaObjectScalarWhereWithAggregatesInput | MediaObjectScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MediaObject"> | string
    mediaId?: StringWithAggregatesFilter<"MediaObject"> | string
    tenantId?: StringWithAggregatesFilter<"MediaObject"> | string
    farmId?: StringNullableWithAggregatesFilter<"MediaObject"> | string | null
    houseId?: StringNullableWithAggregatesFilter<"MediaObject"> | string | null
    stationId?: StringNullableWithAggregatesFilter<"MediaObject"> | string | null
    sensorId?: StringNullableWithAggregatesFilter<"MediaObject"> | string | null
    bucket?: StringWithAggregatesFilter<"MediaObject"> | string
    objectKey?: StringWithAggregatesFilter<"MediaObject"> | string
    fileName?: StringWithAggregatesFilter<"MediaObject"> | string
    fileSize?: BigIntWithAggregatesFilter<"MediaObject"> | bigint | number
    mimeType?: StringWithAggregatesFilter<"MediaObject"> | string
    sha256?: StringWithAggregatesFilter<"MediaObject"> | string
    width?: IntNullableWithAggregatesFilter<"MediaObject"> | number | null
    height?: IntNullableWithAggregatesFilter<"MediaObject"> | number | null
    metadata?: JsonNullableWithAggregatesFilter<"MediaObject">
    time?: DateTimeWithAggregatesFilter<"MediaObject"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"MediaObject"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MediaObject"> | Date | string
  }

  export type ReadingMediaMapWhereInput = {
    AND?: ReadingMediaMapWhereInput | ReadingMediaMapWhereInput[]
    OR?: ReadingMediaMapWhereInput[]
    NOT?: ReadingMediaMapWhereInput | ReadingMediaMapWhereInput[]
    id?: StringFilter<"ReadingMediaMap"> | string
    mediaId?: StringFilter<"ReadingMediaMap"> | string
    readingId?: StringFilter<"ReadingMediaMap"> | string
    deltaMs?: IntFilter<"ReadingMediaMap"> | number
    strategy?: StringFilter<"ReadingMediaMap"> | string
    confidence?: FloatNullableFilter<"ReadingMediaMap"> | number | null
    metadata?: JsonNullableFilter<"ReadingMediaMap">
    createdAt?: DateTimeFilter<"ReadingMediaMap"> | Date | string
    updatedAt?: DateTimeFilter<"ReadingMediaMap"> | Date | string
  }

  export type ReadingMediaMapOrderByWithRelationInput = {
    id?: SortOrder
    mediaId?: SortOrder
    readingId?: SortOrder
    deltaMs?: SortOrder
    strategy?: SortOrder
    confidence?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReadingMediaMapWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    mediaId_readingId?: ReadingMediaMapMediaIdReadingIdCompoundUniqueInput
    AND?: ReadingMediaMapWhereInput | ReadingMediaMapWhereInput[]
    OR?: ReadingMediaMapWhereInput[]
    NOT?: ReadingMediaMapWhereInput | ReadingMediaMapWhereInput[]
    mediaId?: StringFilter<"ReadingMediaMap"> | string
    readingId?: StringFilter<"ReadingMediaMap"> | string
    deltaMs?: IntFilter<"ReadingMediaMap"> | number
    strategy?: StringFilter<"ReadingMediaMap"> | string
    confidence?: FloatNullableFilter<"ReadingMediaMap"> | number | null
    metadata?: JsonNullableFilter<"ReadingMediaMap">
    createdAt?: DateTimeFilter<"ReadingMediaMap"> | Date | string
    updatedAt?: DateTimeFilter<"ReadingMediaMap"> | Date | string
  }, "id" | "mediaId_readingId">

  export type ReadingMediaMapOrderByWithAggregationInput = {
    id?: SortOrder
    mediaId?: SortOrder
    readingId?: SortOrder
    deltaMs?: SortOrder
    strategy?: SortOrder
    confidence?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReadingMediaMapCountOrderByAggregateInput
    _avg?: ReadingMediaMapAvgOrderByAggregateInput
    _max?: ReadingMediaMapMaxOrderByAggregateInput
    _min?: ReadingMediaMapMinOrderByAggregateInput
    _sum?: ReadingMediaMapSumOrderByAggregateInput
  }

  export type ReadingMediaMapScalarWhereWithAggregatesInput = {
    AND?: ReadingMediaMapScalarWhereWithAggregatesInput | ReadingMediaMapScalarWhereWithAggregatesInput[]
    OR?: ReadingMediaMapScalarWhereWithAggregatesInput[]
    NOT?: ReadingMediaMapScalarWhereWithAggregatesInput | ReadingMediaMapScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ReadingMediaMap"> | string
    mediaId?: StringWithAggregatesFilter<"ReadingMediaMap"> | string
    readingId?: StringWithAggregatesFilter<"ReadingMediaMap"> | string
    deltaMs?: IntWithAggregatesFilter<"ReadingMediaMap"> | number
    strategy?: StringWithAggregatesFilter<"ReadingMediaMap"> | string
    confidence?: FloatNullableWithAggregatesFilter<"ReadingMediaMap"> | number | null
    metadata?: JsonNullableWithAggregatesFilter<"ReadingMediaMap">
    createdAt?: DateTimeWithAggregatesFilter<"ReadingMediaMap"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ReadingMediaMap"> | Date | string
  }

  export type MediaObjectCreateInput = {
    id?: string
    mediaId: string
    tenantId: string
    farmId?: string | null
    houseId?: string | null
    stationId?: string | null
    sensorId?: string | null
    bucket: string
    objectKey: string
    fileName: string
    fileSize: bigint | number
    mimeType: string
    sha256: string
    width?: number | null
    height?: number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    time: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MediaObjectUncheckedCreateInput = {
    id?: string
    mediaId: string
    tenantId: string
    farmId?: string | null
    houseId?: string | null
    stationId?: string | null
    sensorId?: string | null
    bucket: string
    objectKey: string
    fileName: string
    fileSize: bigint | number
    mimeType: string
    sha256: string
    width?: number | null
    height?: number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    time: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MediaObjectUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    farmId?: NullableStringFieldUpdateOperationsInput | string | null
    houseId?: NullableStringFieldUpdateOperationsInput | string | null
    stationId?: NullableStringFieldUpdateOperationsInput | string | null
    sensorId?: NullableStringFieldUpdateOperationsInput | string | null
    bucket?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    mimeType?: StringFieldUpdateOperationsInput | string
    sha256?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaObjectUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    farmId?: NullableStringFieldUpdateOperationsInput | string | null
    houseId?: NullableStringFieldUpdateOperationsInput | string | null
    stationId?: NullableStringFieldUpdateOperationsInput | string | null
    sensorId?: NullableStringFieldUpdateOperationsInput | string | null
    bucket?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    mimeType?: StringFieldUpdateOperationsInput | string
    sha256?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaObjectCreateManyInput = {
    id?: string
    mediaId: string
    tenantId: string
    farmId?: string | null
    houseId?: string | null
    stationId?: string | null
    sensorId?: string | null
    bucket: string
    objectKey: string
    fileName: string
    fileSize: bigint | number
    mimeType: string
    sha256: string
    width?: number | null
    height?: number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    time: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MediaObjectUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    farmId?: NullableStringFieldUpdateOperationsInput | string | null
    houseId?: NullableStringFieldUpdateOperationsInput | string | null
    stationId?: NullableStringFieldUpdateOperationsInput | string | null
    sensorId?: NullableStringFieldUpdateOperationsInput | string | null
    bucket?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    mimeType?: StringFieldUpdateOperationsInput | string
    sha256?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MediaObjectUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaId?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    farmId?: NullableStringFieldUpdateOperationsInput | string | null
    houseId?: NullableStringFieldUpdateOperationsInput | string | null
    stationId?: NullableStringFieldUpdateOperationsInput | string | null
    sensorId?: NullableStringFieldUpdateOperationsInput | string | null
    bucket?: StringFieldUpdateOperationsInput | string
    objectKey?: StringFieldUpdateOperationsInput | string
    fileName?: StringFieldUpdateOperationsInput | string
    fileSize?: BigIntFieldUpdateOperationsInput | bigint | number
    mimeType?: StringFieldUpdateOperationsInput | string
    sha256?: StringFieldUpdateOperationsInput | string
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingMediaMapCreateInput = {
    id?: string
    mediaId: string
    readingId: string
    deltaMs: number
    strategy: string
    confidence?: number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadingMediaMapUncheckedCreateInput = {
    id?: string
    mediaId: string
    readingId: string
    deltaMs: number
    strategy: string
    confidence?: number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadingMediaMapUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaId?: StringFieldUpdateOperationsInput | string
    readingId?: StringFieldUpdateOperationsInput | string
    deltaMs?: IntFieldUpdateOperationsInput | number
    strategy?: StringFieldUpdateOperationsInput | string
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingMediaMapUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaId?: StringFieldUpdateOperationsInput | string
    readingId?: StringFieldUpdateOperationsInput | string
    deltaMs?: IntFieldUpdateOperationsInput | number
    strategy?: StringFieldUpdateOperationsInput | string
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingMediaMapCreateManyInput = {
    id?: string
    mediaId: string
    readingId: string
    deltaMs: number
    strategy: string
    confidence?: number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReadingMediaMapUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaId?: StringFieldUpdateOperationsInput | string
    readingId?: StringFieldUpdateOperationsInput | string
    deltaMs?: IntFieldUpdateOperationsInput | number
    strategy?: StringFieldUpdateOperationsInput | string
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReadingMediaMapUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    mediaId?: StringFieldUpdateOperationsInput | string
    readingId?: StringFieldUpdateOperationsInput | string
    deltaMs?: IntFieldUpdateOperationsInput | number
    strategy?: StringFieldUpdateOperationsInput | string
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type MediaObjectCountOrderByAggregateInput = {
    id?: SortOrder
    mediaId?: SortOrder
    tenantId?: SortOrder
    farmId?: SortOrder
    houseId?: SortOrder
    stationId?: SortOrder
    sensorId?: SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    sha256?: SortOrder
    width?: SortOrder
    height?: SortOrder
    metadata?: SortOrder
    time?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MediaObjectAvgOrderByAggregateInput = {
    fileSize?: SortOrder
    width?: SortOrder
    height?: SortOrder
  }

  export type MediaObjectMaxOrderByAggregateInput = {
    id?: SortOrder
    mediaId?: SortOrder
    tenantId?: SortOrder
    farmId?: SortOrder
    houseId?: SortOrder
    stationId?: SortOrder
    sensorId?: SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    sha256?: SortOrder
    width?: SortOrder
    height?: SortOrder
    time?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MediaObjectMinOrderByAggregateInput = {
    id?: SortOrder
    mediaId?: SortOrder
    tenantId?: SortOrder
    farmId?: SortOrder
    houseId?: SortOrder
    stationId?: SortOrder
    sensorId?: SortOrder
    bucket?: SortOrder
    objectKey?: SortOrder
    fileName?: SortOrder
    fileSize?: SortOrder
    mimeType?: SortOrder
    sha256?: SortOrder
    width?: SortOrder
    height?: SortOrder
    time?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MediaObjectSumOrderByAggregateInput = {
    fileSize?: SortOrder
    width?: SortOrder
    height?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type ReadingMediaMapMediaIdReadingIdCompoundUniqueInput = {
    mediaId: string
    readingId: string
  }

  export type ReadingMediaMapCountOrderByAggregateInput = {
    id?: SortOrder
    mediaId?: SortOrder
    readingId?: SortOrder
    deltaMs?: SortOrder
    strategy?: SortOrder
    confidence?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReadingMediaMapAvgOrderByAggregateInput = {
    deltaMs?: SortOrder
    confidence?: SortOrder
  }

  export type ReadingMediaMapMaxOrderByAggregateInput = {
    id?: SortOrder
    mediaId?: SortOrder
    readingId?: SortOrder
    deltaMs?: SortOrder
    strategy?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReadingMediaMapMinOrderByAggregateInput = {
    id?: SortOrder
    mediaId?: SortOrder
    readingId?: SortOrder
    deltaMs?: SortOrder
    strategy?: SortOrder
    confidence?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReadingMediaMapSumOrderByAggregateInput = {
    deltaMs?: SortOrder
    confidence?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}