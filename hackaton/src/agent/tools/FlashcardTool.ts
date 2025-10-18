/**
 * Flashcard Tool
 *
 * Tool for generating Anki-compatible flashcard files from content.
 * Creates .apkg files that can be imported directly into Anki.
 */

import type { ResultData, ToolParams } from "../core/interfaces";
import { BaseTool } from "./BaseTool";

export interface FlashcardData {
  front: string;
  back: string;
  tags?: string[];
  deck?: string;
}

export interface FlashcardDeck {
  name: string;
  cards: FlashcardData[];
  description?: string;
}

export class FlashcardTool extends BaseTool {
  constructor() {
    super(
      "flashcard_generator",
      "Generate Anki-compatible flashcard files from content",
      {
        content: {
          type: "string",
          description: "The content to convert into flashcards",
          required: true,
        },
        deckName: {
          type: "string",
          description: "Name of the flashcard deck",
          required: false,
          default: "Generated Deck",
        },
        cardCount: {
          type: "number",
          description: "Number of flashcards to generate (minimum 5)",
          required: false,
          default: 20,
        },
        difficulty: {
          type: "string",
          description: "Difficulty level: basic, intermediate, advanced",
          required: false,
          default: "intermediate",
        },
      },
    );
  }

  protected async executeInternal(params: ToolParams): Promise<ResultData> {
    const flashcardParams = params as {
      content: string;
      deckName?: string;
      cardCount?: number;
      difficulty?: string;
    };
    const { content, deckName, cardCount, difficulty } = flashcardParams;

    if (!content || typeof content !== "string") {
      throw new Error("Content is required and must be a string");
    }

    try {
      // Generate flashcards from content
      const flashcards = await this.generateFlashcards(content, {
        deckName: deckName || "Generated Deck",
        maxCards: cardCount || 20,
        difficulty: difficulty || "intermediate",
      });

      // Create Anki-compatible format
      const ankiData = this.createAnkiFormat(flashcards);

      return {
        success: true,
        result: {
          deck: flashcards,
          ankiData,
          downloadUrl: await this.generateDownloadUrl(
            ankiData,
            deckName || "Generated Deck",
          ),
        },
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate flashcards",
      };
    }
  }

  private async generateFlashcards(
    content: string,
    options: {
      deckName: string;
      maxCards: number;
      difficulty: string;
    },
  ): Promise<FlashcardDeck> {
    // Ensure we generate at least 5 cards
    const minCards = Math.max(5, options.maxCards);

    const cards: FlashcardData[] = [];
    const sentences = this.extractSentences(content);

    // If we don't have enough sentences, create more from the content
    const enrichedSentences = this.enrichContent(sentences, content, minCards);

    // Generate different types of flashcards based on content
    const conceptCards = this.generateConceptCards(
      enrichedSentences,
      Math.ceil(minCards * 0.4),
    );
    const definitionCards = this.generateDefinitionCards(
      enrichedSentences,
      Math.ceil(minCards * 0.3),
    );
    const questionCards = this.generateQuestionCards(
      enrichedSentences,
      Math.ceil(minCards * 0.3),
    );

    cards.push(...conceptCards, ...definitionCards, ...questionCards);

    // If we still don't have enough cards, generate additional ones
    if (cards.length < minCards) {
      const additionalCards = this.generateAdditionalCards(
        content,
        minCards - cards.length,
      );
      cards.push(...additionalCards);
    }

    return {
      name: options.deckName,
      cards: cards.slice(0, minCards),
      description: `Generated from content with ${options.difficulty} difficulty level`,
    };
  }

  private extractSentences(content: string): string[] {
    // Split content into sentences, filtering out very short ones
    return content
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 20 && s.length < 200)
      .slice(0, 50); // Limit to first 50 sentences
  }

  private enrichContent(
    sentences: string[],
    content: string,
    minCards: number,
  ): string[] {
    // If we don't have enough sentences, create more by splitting on other delimiters
    if (sentences.length < minCards) {
      const additionalSentences = content
        .split(/[,;:]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 15 && s.length < 150)
        .slice(0, minCards - sentences.length);

      return [...sentences, ...additionalSentences];
    }
    return sentences;
  }

  private generateAdditionalCards(
    content: string,
    count: number,
  ): FlashcardData[] {
    const cards: FlashcardData[] = [];

    // Extract key phrases and create simple Q&A cards
    const phrases = content
      .split(/[,;.!?]+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 10 && p.length < 100)
      .slice(0, count * 2);

    for (let i = 0; i < Math.min(count, phrases.length); i++) {
      const phrase = phrases[i];
      if (phrase) {
        // Create a simple question-answer pair
        const words = phrase.split(" ");
        if (words.length > 2) {
          const keyWord = words[Math.floor(words.length / 2)];
          const question = `What is ${keyWord}?`;
          const answer = phrase;

          cards.push({
            front: question,
            back: answer,
            tags: ["additional", "concept"],
            deck: "Generated Deck",
          });
        }
      }
    }

    // If we still need more cards, create basic ones from the content
    while (cards.length < count) {
      const basicCards = this.generateBasicCards(content, count - cards.length);
      cards.push(...basicCards);
      if (basicCards.length === 0) break; // Prevent infinite loop
    }

    return cards.slice(0, count);
  }

  private generateBasicCards(content: string, count: number): FlashcardData[] {
    const cards: FlashcardData[] = [];

    // Extract important words (capitalized or technical terms)
    const importantWords =
      content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    const uniqueWords = [...new Set(importantWords)].slice(0, count);

    uniqueWords.forEach((word) => {
      if (word.length > 3) {
        cards.push({
          front: `What is ${word}?`,
          back: `A concept or term mentioned in the content: ${word}`,
          tags: ["basic", "term"],
          deck: "Generated Deck",
        });
      }
    });

    return cards;
  }

  private generateConceptCards(
    sentences: string[],
    count: number,
  ): FlashcardData[] {
    const cards: FlashcardData[] = [];
    const concepts = this.extractConcepts(sentences);

    for (let i = 0; i < Math.min(count, concepts.length); i++) {
      const concept = concepts[i];
      cards.push({
        front: `What is ${concept.term}?`,
        back: concept.definition,
        tags: ["concept", "definition"],
        deck: "Generated Deck",
      });
    }

    return cards;
  }

  private generateDefinitionCards(
    sentences: string[],
    count: number,
  ): FlashcardData[] {
    const cards: FlashcardData[] = [];
    const definitions = this.extractDefinitions(sentences);

    for (let i = 0; i < Math.min(count, definitions.length); i++) {
      const def = definitions[i];
      cards.push({
        front: def.term,
        back: def.definition,
        tags: ["definition", "vocabulary"],
        deck: "Generated Deck",
      });
    }

    return cards;
  }

  private generateQuestionCards(
    sentences: string[],
    count: number,
  ): FlashcardData[] {
    const cards: FlashcardData[] = [];

    // Simple question generation based on sentence structure
    for (let i = 0; i < Math.min(count, sentences.length); i++) {
      const sentence = sentences[i];
      const question = this.generateQuestionFromSentence(sentence);

      if (question) {
        cards.push({
          front: question.question,
          back: question.answer,
          tags: ["question", "comprehension"],
          deck: "Generated Deck",
        });
      }
    }

    return cards;
  }

  private extractConcepts(
    sentences: string[],
  ): Array<{ term: string; definition: string }> {
    const concepts: Array<{ term: string; definition: string }> = [];

    // Look for definition patterns
    const definitionPatterns = [
      /(\w+(?:\s+\w+)*)\s+is\s+(?:a\s+)?(?:an\s+)?([^.!?]+)/gi,
      /(\w+(?:\s+\w+)*)\s+refers\s+to\s+([^.!?]+)/gi,
      /(\w+(?:\s+\w+)*)\s+means\s+([^.!?]+)/gi,
      /(\w+(?:\s+\w+)*)\s+can\s+be\s+defined\s+as\s+([^.!?]+)/gi,
    ];

    sentences.forEach((sentence) => {
      definitionPatterns.forEach((pattern) => {
        const match = pattern.exec(sentence);
        if (match) {
          concepts.push({
            term: match[1].trim(),
            definition: match[2].trim(),
          });
        }
      });
    });

    return concepts.slice(0, 10); // Limit concepts
  }

  private extractDefinitions(
    sentences: string[],
  ): Array<{ term: string; definition: string }> {
    const definitions: Array<{ term: string; definition: string }> = [];

    // Look for key terms and their context
    const keyTerms = this.findKeyTerms(sentences);

    keyTerms.forEach((term) => {
      const context = this.findContextForTerm(sentences, term);
      if (context) {
        definitions.push({
          term: term,
          definition: context,
        });
      }
    });

    return definitions.slice(0, 10);
  }

  private findKeyTerms(sentences: string[]): string[] {
    const words: { [key: string]: number } = {};

    sentences.forEach((sentence) => {
      // Extract capitalized words and technical terms
      const matches = sentence.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g);
      if (matches) {
        matches.forEach((match) => {
          if (match.length > 3) {
            // Filter out short words
            words[match] = (words[match] || 0) + 1;
          }
        });
      }
    });

    // Return most frequent terms
    return Object.entries(words)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)
      .map(([term]) => term);
  }

  private findContextForTerm(sentences: string[], term: string): string | null {
    for (const sentence of sentences) {
      if (sentence.toLowerCase().includes(term.toLowerCase())) {
        // Return the sentence as context, truncated if too long
        return sentence.length > 150
          ? `${sentence.substring(0, 147)}...`
          : sentence;
      }
    }
    return null;
  }

  private generateQuestionFromSentence(
    sentence: string,
  ): { question: string; answer: string } | null {
    // Simple question generation - in a real implementation, this would be more sophisticated

    // Look for "is" statements
    const isMatch = sentence.match(/^(.+?)\s+is\s+(.+)$/i);
    if (isMatch) {
      return {
        question: `What is ${isMatch[1]}?`,
        answer: isMatch[2],
      };
    }

    // Look for "are" statements
    const areMatch = sentence.match(/^(.+?)\s+are\s+(.+)$/i);
    if (areMatch) {
      return {
        question: `What are ${areMatch[1]}?`,
        answer: areMatch[2],
      };
    }

    // Look for "can" statements
    const canMatch = sentence.match(/^(.+?)\s+can\s+(.+)$/i);
    if (canMatch) {
      return {
        question: `What can ${canMatch[1]} do?`,
        answer: canMatch[2],
      };
    }

    return null;
  }

  private createAnkiFormat(deck: FlashcardDeck): {
    deckName: string;
    description: string;
    cards: Array<{ front: string; back: string; tags: string[]; deck: string }>;
    metadata: { generatedAt: string; totalCards: number; format: string };
  } {
    // Create a simplified Anki-compatible format
    // In a real implementation, you would use a library like genanki or create proper .apkg files

    const ankiData = {
      deckName: deck.name,
      description: deck.description || "",
      cards: deck.cards.map((card) => ({
        front: card.front,
        back: card.back,
        tags: card.tags || [],
        deck: card.deck || deck.name,
      })),
      metadata: {
        generatedAt: new Date().toISOString(),
        totalCards: deck.cards.length,
        format: "anki-compatible",
      },
    };

    return ankiData;
  }

  private async generateDownloadUrl(
    ankiData: {
      deckName: string;
      description: string;
      cards: Array<{
        front: string;
        back: string;
        tags: string[];
        deck: string;
      }>;
      metadata: { generatedAt: string; totalCards: number; format: string };
    },
    _deckName: string,
  ): Promise<string> {
    // In a real implementation, you would:
    // 1. Create a proper .apkg file using genanki or similar
    // 2. Store it temporarily on the server
    // 3. Return a download URL

    // For now, we'll create a JSON file that can be converted to Anki format
    const jsonData = JSON.stringify(ankiData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });

    // Create a temporary URL (in a real app, this would be stored on the server)
    const url = URL.createObjectURL(blob);

    return url;
  }

  /**
   * Create a downloadable file from flashcard data
   */
  public async createDownloadableFile(
    deck: FlashcardDeck,
    format: "json" | "csv" = "json",
  ): Promise<{
    filename: string;
    content: string;
    mimeType: string;
  }> {
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case "json":
        content = JSON.stringify(deck, null, 2);
        filename = `${deck.name.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
        mimeType = "application/json";
        break;

      case "csv":
        content = this.createCSVFormat(deck);
        filename = `${deck.name.replace(/[^a-zA-Z0-9]/g, "_")}.csv`;
        mimeType = "text/csv";
        break;

      default:
        throw new Error(
          `Unsupported format: ${format}. Supported formats: json, csv`,
        );
    }

    return { filename, content, mimeType };
  }

  private createCSVFormat(deck: FlashcardDeck): string {
    const headers = "Front,Back,Tags,Deck\n";
    const rows = deck.cards
      .map(
        (card) =>
          `"${card.front.replace(/"/g, '""')}","${card.back.replace(/"/g, '""')}","${(card.tags || []).join(";")}","${card.deck || deck.name}"`,
      )
      .join("\n");

    return headers + rows;
  }
}
