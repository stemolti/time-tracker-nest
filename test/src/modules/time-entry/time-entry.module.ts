import { DynamicModule, Module, Provider } from "@nestjs/common";
import { TimeEntryDataSource } from "./datasource/time-entry.ds";
import { MongooseModule } from "@nestjs/mongoose";
import { TimeEntry, TimeEntrySchema } from "./entity/time-entry.schema";

@Module({})
export class TimeEntryModule {
  static forRoot(providers: Provider[], global = true): DynamicModule {
    return {
      global,
      module: TimeEntryModule,
      imports: [MongooseModule.forFeature([{name: TimeEntry.name, schema: TimeEntrySchema}])],
      providers: [
        ...providers
      ],
      exports: [TimeEntryDataSource]
    }
  }
}