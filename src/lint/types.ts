export type Lang = "typescript" | "javascript" | "java";
export type Severity = "error" | "warn" | "info";

export interface Edit {
  start: number;
  end: number;
  text: string;
}

export interface Comment {
  start: number;
  end: number;
  block: boolean;
}

export interface Position {
  line: number;
  col: number;
}

/** Source text plus everything the rules need: comment/string-free copy, comments, indent unit. */
export interface Source {
  src: string;
  /** Same length as `src`; comments and string contents are blanked so structure can be scanned safely. */
  masked: string;
  comments: Comment[];
  lang: Lang;
  unit: string;
  position(offset: number): Position;
}

/** A rule violation. `edits` is present only when the fix is mechanical and safe. */
export interface Finding {
  rule: string;
  severity: Severity;
  start: number;
  end: number;
  message: string;
  edits?: Edit[];
}

export interface Issue extends Finding, Position {
  fixable: boolean;
}

export interface Rule {
  id: string;
  title: string;
  /** Doc slug that explains the rule. */
  docs: string;
  langs?: Lang[];
  find(source: Source): Finding[];
}
