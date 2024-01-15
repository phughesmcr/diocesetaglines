import OpenAI from "https://deno.land/x/openai@v4.24.1/mod.ts";
import Tags from "./taglines.json" with { type: "json" };

type TagData = {
  dio: string;
  tag: string;
};

const openai = new OpenAI({
  apiKey: Deno.env.get("OPENAI_API_KEY")!,
});

const res: string[] = [
  "Diocese,Tagline,embedding\n",
];

const tagData = Tags as TagData[];
for (const data of tagData) {
  const params: OpenAI.EmbeddingCreateParams = {
    model: "text-embedding-ada-002",
    encoding_format: "float",
    input: data.tag,
  };
  const result = await openai.embeddings.create(params);
  res.push(`"${data.dio}","${data.tag}","[${result.data[0].embedding.join(",")}]"\n`);
}

Deno.writeTextFileSync("./result.csv", res.join(""));
