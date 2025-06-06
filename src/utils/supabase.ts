import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bpjxzptgdqblkvosxrvv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwanh6cHRnZHFibGt2b3N4cnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMzMyMTUsImV4cCI6MjA2NDgwOTIxNX0.20tUjffUlDLM76gASymhvcsGpwTnW5HVfQN7XKY6hBk';
export const supabase = createClient(supabaseUrl, supabaseKey);