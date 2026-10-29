## Building distributed applications with cluster

The cluster modules let you model stateful services as entities and distribute
them across multiple machines.

Set `ShardingConfig.runnerJoinDebounce` to group shard moves during scale-up
or deployments with many joining runners. It defaults to zero; departures
and unhealthy runners still update assignments immediately.

Provide `Digest.Digest` when constructing `SqlMessageStorage` or
`SingleRunner` directly. `NodeClusterSocket.layer` supplies its digest layer.
Use `SqlMessageStorage.makeEncodedStorage` when migrations run separately;
run `layerMigrations` with the same table prefix before using the storage.

Treat RPC calls with `discard: true` as acknowledged calls: they complete
when the server acknowledges them. Observe disconnections with
`RpcServer`'s `onDisconnect` option; consuming `Protocol.disconnects` would
take events needed by the server.
