/**
 * Flashcard Agent
 *
 * Specialized agent for generating Anki-compatible flashcards from content.
 * Creates downloadable flashcard files that can be imported into Anki.
 */

import { BaseAgent } from "../core/BaseAgent";
import type { AgentConfig, AgentResult, ToolParams } from "../core/interfaces";
import { FlashcardTool } from "../tools/FlashcardTool";

export interface FlashcardTask {
  content: string;
  deckName?: string;
  cardCount?: number;
  difficulty?: "basic" | "intermediate" | "advanced";
  outputFormat?: "json" | "csv";
  tags?: string[];
}

export class FlashcardAgent extends BaseAgent {
  private flashcardTool: FlashcardTool;

  constructor(config: Omit<AgentConfig, "capabilities">) {
    // Create complete agent configuration with capabilities
    const agentConfig: AgentConfig = {
      ...config,
      capabilities: [
        "flashcard_generation",
        "content_analysis",
        "anki_export",
        "study_material_creation",
        "educational_content_processing",
        "file_generation",
      ],
    };

    super(agentConfig.id, agentConfig);
    this.flashcardTool = new FlashcardTool();
  }

  protected initialize(): void {
    // Register tools
    this.registerTool("flashcard_generator", this.flashcardTool);

    console.log(
      `FlashcardAgent ${this.id} initialized with tools:`,
      this.getTools(),
    );
    console.log(
      `FlashcardAgent ${this.id} using model:`,
      this.getModelConfig().model,
    );
    console.log(
      `FlashcardAgent ${this.id} system prompt:`,
      this.getSystemPrompt(),
    );
  }

  protected generateSystemPrompt(): string {
    return `You are a Flashcard Agent specialized in creating educational flashcards from content.

ROLE:
You are an expert in educational content analysis and flashcard creation. Your primary goal is to analyze provided content and generate high-quality flashcards that facilitate effective learning and memorization.

TOOLS AVAILABLE:
- flashcard_generator: Generate flashcards from content with customizable options

CAPABILITIES:
1. Content Analysis: Extract key concepts, definitions, and important information
2. Flashcard Generation: Create question-answer pairs optimized for spaced repetition
3. Multiple Formats: Generate flashcards in various formats (JSON, CSV)
4. Difficulty Adaptation: Adjust complexity based on user requirements
5. Tagging System: Organize flashcards with relevant tags for better categorization

DECISION LOGIC:
1. Analyze the provided content to identify:
   - Key concepts and definitions
   - Important facts and details
   - Relationships between concepts
   - Question-worthy information

2. Generate flashcards using appropriate strategies:
   - Concept cards: "What is X?" format
   - Definition cards: Term-definition pairs
   - Question cards: Comprehension-based questions
   - Process cards: Step-by-step procedures

3. Optimize for learning effectiveness:
   - Clear, concise questions
   - Comprehensive but focused answers
   - Appropriate difficulty level
   - Logical organization and tagging

OUTPUT REQUIREMENTS:
- Generate the requested number of flashcards (minimum: 5, default: 20)
- Use the specified deck name or generate an appropriate one
- Apply relevant tags for organization
- Ensure content is accurate and educational
- Provide multiple format options for download
- Always ensure at least 5 flashcards are generated regardless of content length

INSTRUCTIONS:
1. Analyze the content thoroughly to identify key learning points
2. Generate flashcards that cover the most important concepts
3. Ensure questions are clear and answers are comprehensive
4. Apply appropriate tags for categorization
5. Create downloadable files in the requested format
6. Provide a summary of the generated flashcards

STYLE:
- Focus on educational value and learning effectiveness
- Use clear, concise language
- Ensure accuracy and completeness
- Organize content logically
- Make flashcards suitable for spaced repetition learning

Your purpose is to transform any content into effective study materials that enhance learning and retention.`;
  }

  public async execute(task: ToolParams): Promise<AgentResult> {
    const startTime = Date.now();
    this.setStatus("busy");

    try {
      const flashcardTask = task as unknown as FlashcardTask;

      // Validate task
      if (!this.canHandle(task)) {
        throw new Error("FlashcardAgent cannot handle this task");
      }

      console.log(
        `FlashcardAgent ${this.id} starting flashcard generation for deck: ${flashcardTask.deckName || "Generated Deck"}`,
      );

      // Generate flashcards using the tool - ensure minimum of 5 cards
      const requestedCount = flashcardTask.cardCount || 20;
      const minCards = Math.max(5, requestedCount);

      const result = await this.flashcardTool.execute({
        content: flashcardTask.content,
        deckName: flashcardTask.deckName || "Generated Deck",
        cardCount: minCards,
        difficulty: flashcardTask.difficulty || "intermediate",
      });

      if (!result.success) {
        throw new Error(
          typeof result.error === "string"
            ? result.error
            : "Failed to generate flashcards",
        );
      }

      const flashcardResult = result.result as {
        deck: {
          name: string;
          cards: Array<{ front: string; back: string; tags?: string[] }>;
        };
      };

      // Create downloadable files in requested formats
      const downloadFiles = await this.createDownloadFiles(
        flashcardResult.deck,
        flashcardTask.outputFormat || "json",
      );

      // Format the final result
      const formattedResult = {
        deck: flashcardResult.deck,
        summary: this.createSummary(flashcardResult.deck),
        downloadFiles,
        metadata: {
          totalCards: flashcardResult.deck.cards.length,
          deckName: flashcardResult.deck.name,
          generatedAt: new Date().toISOString(),
          difficulty: flashcardTask.difficulty || "intermediate",
        },
      };

      this.setStatus("idle");

      return {
        success: true,
        result: formattedResult,
        executionTime: Date.now() - startTime,
        metadata: {
          agentId: this.id,
          taskType: "flashcard_generation",
          cardsGenerated: flashcardResult.deck.cards.length,
          formatsGenerated: downloadFiles.length,
        },
      };
    } catch (error) {
      this.setStatus("error");
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        executionTime: Date.now() - startTime,
      };
    }
  }

  public canHandle(task: ToolParams): boolean {
    const flashcardTask = task as unknown as FlashcardTask;
    return (
      flashcardTask &&
      typeof flashcardTask === "object" &&
      "content" in flashcardTask &&
      typeof flashcardTask.content === "string" &&
      flashcardTask.content.trim().length > 0
    );
  }

  public getCapabilities(): string[] {
    return [
      "flashcard_generation",
      "content_analysis",
      "anki_export",
      "study_material_creation",
      "educational_content_processing",
      "file_generation",
    ];
  }

  private async createDownloadFiles(
    deck: {
      name: string;
      cards: Array<{ front: string; back: string; tags?: string[] }>;
    },
    requestedFormat: string,
  ): Promise<
    Array<{
      format: string;
      filename: string;
      content: string;
      mimeType: string;
      downloadUrl?: string;
    }>
  > {
    const files = [];

    // Always generate the requested format
    const formats = [requestedFormat];

    // Also generate CSV as an additional format for better compatibility
    if (requestedFormat === "json") {
      formats.push("csv");
    } else if (requestedFormat === "csv") {
      formats.push("json");
    }

    for (const format of formats) {
      try {
        const fileData = await this.flashcardTool.createDownloadableFile(
          deck,
          format as "json" | "csv",
        );
        files.push({
          format,
          filename: fileData.filename,
          content: fileData.content,
          mimeType: fileData.mimeType,
        });
      } catch (error) {
        console.error(`Failed to create ${format} file:`, error);
      }
    }

    return files;
  }

  private createSummary(deck: {
    name: string;
    description?: string;
    cards: Array<{ front: string; back: string; tags?: string[] }>;
  }): string {
    const cardCount = deck.cards.length;
    const tags = [...new Set(deck.cards.flatMap((card) => card.tags || []))];

    let summary = `# Flashcard Deck Summary\n\n`;
    summary += `**Deck Name:** ${deck.name}\n`;
    summary += `**Total Cards:** ${cardCount}\n`;
    summary += `**Description:** ${deck.description || "Generated from content"}\n\n`;

    if (tags.length > 0) {
      summary += `**Tags Used:** ${tags.join(", ")}\n\n`;
    }

    summary += `## Card Types Generated\n\n`;

    // Analyze card types
    const cardTypes = this.analyzeCardTypes(deck.cards);
    Object.entries(cardTypes).forEach(([type, count]) => {
      summary += `- **${type}:** ${count} cards\n`;
    });

    summary += `\n## Sample Cards\n\n`;

    // Show a few sample cards
    const sampleCards = deck.cards.slice(0, 3);
    sampleCards.forEach((card, index: number) => {
      summary += `**Card ${index + 1}:**\n`;
      summary += `- Front: ${card.front}\n`;
      summary += `- Back: ${card.back.substring(0, 100)}${card.back.length > 100 ? "..." : ""}\n`;
      if (card.tags && card.tags.length > 0) {
        summary += `- Tags: ${card.tags.join(", ")}\n`;
      }
      summary += `\n`;
    });

    summary += `---\n`;
    summary += `*Flashcards generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*\n`;
    summary += `*Ready for import into flashcard applications or study tools*\n`;

    return summary;
  }

  private analyzeCardTypes(cards: Array<{ tags?: string[] }>): {
    [key: string]: number;
  } {
    const types: { [key: string]: number } = {};

    cards.forEach((card) => {
      if (card.tags && card.tags.length > 0) {
        card.tags.forEach((tag: string) => {
          types[tag] = (types[tag] || 0) + 1;
        });
      } else {
        types.untagged = (types.untagged || 0) + 1;
      }
    });

    return types;
  }
}
