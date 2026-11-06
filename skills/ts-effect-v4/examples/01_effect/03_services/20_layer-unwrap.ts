/**
 * @title Creating Layers from configuration and/or Effects
 *
 * Build a layer dynamically from an Effect / Config with `Layer.unwrap`.
 */
import { Config, Context, Effect, Layer, Schema } from "effect"

export class MessageStoreError extends Schema.TaggedError<MessageStoreError>()("MessageStoreError", {
  cause: Schema.Defect()
}) {}

export class MessageStore extends Context.Service<MessageStore, {
  append(message: string): Effect.Effect<void>
  readonly all: Effect.Effect<ReadonlyArray<string>>
}>()("myapp/MessageStore") {
  static readonly makeInMemory = Effect.sync(() => {
    const messages: Array<string> = []

    return MessageStore.of({
      append: (message) =>
        Effect.sync(() => {
          messages.push(message)
        }),
      all: Effect.sync(() => [...messages])
    })
  })

  static readonly makeRemote = (url: URL) =>
    Effect.try({
      try: () => {
        // In a real app this is where you would open a network connection.
        const messages: Array<string> = []

        return MessageStore.of({
          append: (message) =>
            Effect.sync(() => {
              messages.push(`[${url.host}] ${message}`)
            }),
          all: Effect.sync(() => [...messages])
        })
      },
      catch: (cause) => new MessageStoreError({ cause })
    })

  static readonly layerInMemory = Layer.effect(this, this.makeInMemory)

  static readonly layerRemote = (url: URL) =>
    Layer.effect(this, this.makeRemote(url))

  static readonly selectLayer = Effect.gen(function*() {
    // Read config inside an Effect, then choose which concrete layer to use.
    const useInMemory = yield* Config.Boolean("MESSAGE_STORE_IN_MEMORY").pipe(
      Config.withDefault(false)
    )

    if (useInMemory) {
      return MessageStore.layerInMemory
    }

    const remoteUrl = yield* Config.URL("MESSAGE_STORE_URL")
    return MessageStore.layerRemote(remoteUrl)
  })

  static readonly layer = Layer.unwrap(this.selectLayer)
}
