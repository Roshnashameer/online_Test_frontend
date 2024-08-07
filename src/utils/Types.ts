// src/types.ts

export interface User {
    name: string;
    email: string;
    phone: string;
  }
  

export interface Question {
    question: string;
    choices: string[];
    correctChoice: number;
  }
  
  
  export interface TestResult {
    score: number;
    total: number;
  }
  