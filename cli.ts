import { program } from "commander";
import visit from "./lib/visit";
import findStories from "./lib/find-stories";
import getCurl from "./lib/get-curl";
import run from "./lib/run";
import path from "path";

program
  .name("fetchbook")
  .description("Manage your HTTP requests")
  .argument("[story]", "story file path")
  .option("-a, --all", "process all stories in a folder recursively")
  .option("-v, --verbose", "verbose")
  .option("-d, --dry-run", "dry run")
  .option("-c, --curl", "convert to curl")
  .option("--demo", "use demo stories")
  .action(async (storyFilePath, options) =>
    visit(
      await findStories(
        options.demo
          ? path.relative(process.cwd(), path.join(__dirname, "examples"))
          : storyFilePath,
        options.all,
      ),
      async (story) => {
        const request = new Request(story.url, story.init);
        if (options.curl) {
          console.log(await getCurl(request));
        } else {
          await run(story, request, options);
        }
      },
    ),
  )
  .parse();
