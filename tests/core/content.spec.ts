import { DateTime, Duration, Effect, Either, Option, Schema } from "effect";
import * as Content from "@/core/content";
import * as Fixture from "../_fixtures/index.fixture";

describe("Core > Content", () => {
	describe("Slug", () => {
		it("should validate correctly the string", () => {
			const output = Schema.decodeEither(Content.Slug)("my-string_1");

			expect(Either.isRight(output)).toBeTruthy();
		});

		it("should fail the validation - space", () => {
			const output = Schema.decodeEither(Content.Slug)("my string 1");

			expect(Either.isLeft(output)).toBeTruthy();
		});
	});

	describe("CreatedAt", () => {
		it("should vaildate and convert the string - no timezone", () => {
			const output = Effect.runSync(
				Schema.decode(Content.CreatedAt)("2025/12/12").pipe(
					Fixture.Config.provide(),
					Effect.either,
				),
			);

			expect(Either.isRight(output)).toBeTruthy();
		});

		it("should vaildate and convert the string - with timezone", () => {
			const timezone = "Europe/Paris";
			const output = Effect.runSync(
				Schema.decode(Content.CreatedAt)(`2025/12/12 15:00 [${timezone}]`).pipe(
					Fixture.Config.provide(),
					Effect.either,
				),
			);

			expect(Either.isRight(output)).toBeTruthy();
			if (Either.isLeft(output)) {
				throw new Error("Unreachable");
			}

			expect(DateTime.zoneToString(output.right.zone)).toBe(timezone);
		});
	});

	describe("serialize", () => {
		it("should serialize correctly", () => {
			const slug = "slug";
			const metadata = {
				title: "my title",
				timeToRead: Duration.seconds(60),
				createdAt: DateTime.makeZonedFromString(
					"12/12/2025 12:00 [Asia/Tokyo]",
				).pipe(Option.getOrThrow),
			};
			const output = Content.serialize({
				slug: Content.Slug.make(slug),
				metadata,
				render: () => "hello",
			});

			expect(output).toEqual({
				slug,
				metadata: {
					title: metadata.title,
					timeToRead: 1,
					createdAt: new Date("2025-12-12T21:00:00.000Z"),
				},
			});
		});
	});
});
