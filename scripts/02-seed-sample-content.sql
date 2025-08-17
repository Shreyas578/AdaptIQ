-- Insert sample learning content
INSERT INTO learning_content (title, description, content_type, subject, difficulty_level, age_range, content_data, accessibility_features) VALUES
(
  'Basic Addition',
  'Learn to add numbers 1-10 with visual aids and interactive exercises',
  'lesson',
  'math',
  1,
  '{5,8}',
  '{
    "instructions": "Let''s learn to add numbers together!",
    "examples": [
      {"problem": "2 + 3", "answer": 5, "visual_aid": "dots"},
      {"problem": "1 + 4", "answer": 5, "visual_aid": "blocks"}
    ],
    "exercises": [
      {"problem": "3 + 2", "answer": 5},
      {"problem": "4 + 1", "answer": 5},
      {"problem": "2 + 2", "answer": 4}
    ]
  }',
  '{"text_to_speech", "high_contrast", "large_text", "sign_language"}'
),
(
  'Letter Recognition A-E',
  'Interactive letter recognition with audio pronunciation and visual cues',
  'lesson',
  'reading',
  1,
  '{4,7}',
  '{
    "instructions": "Let''s learn the first five letters of the alphabet!",
    "letters": [
      {"letter": "A", "sound": "/æ/", "word": "Apple", "image": "apple.png"},
      {"letter": "B", "sound": "/b/", "word": "Ball", "image": "ball.png"},
      {"letter": "C", "sound": "/k/", "word": "Cat", "image": "cat.png"},
      {"letter": "D", "sound": "/d/", "word": "Dog", "image": "dog.png"},
      {"letter": "E", "sound": "/ɛ/", "word": "Elephant", "image": "elephant.png"}
    ],
    "activities": [
      {"type": "match_letter_sound", "count": 5},
      {"type": "trace_letter", "count": 5},
      {"type": "identify_letter", "count": 10}
    ]
  }',
  '{"text_to_speech", "audio_descriptions", "high_contrast", "large_text", "sign_language", "motor_assistance"}'
),
(
  'Shapes and Colors',
  'Learn basic shapes and colors through interactive games and activities',
  'game',
  'general',
  1,
  '{3,6}',
  '{
    "instructions": "Explore shapes and colors in this fun interactive game!",
    "shapes": ["circle", "square", "triangle", "rectangle"],
    "colors": ["red", "blue", "yellow", "green", "orange", "purple"],
    "activities": [
      {"type": "shape_sorting", "difficulty": 1},
      {"type": "color_matching", "difficulty": 1},
      {"type": "shape_color_combo", "difficulty": 2}
    ],
    "rewards": {
      "completion": "star_sticker",
      "perfect_score": "rainbow_badge"
    }
  }',
  '{"text_to_speech", "audio_descriptions", "high_contrast", "large_text", "sign_language", "simplified_interface"}'
);

-- Insert sample sign language interpretations
INSERT INTO sign_language_content (content_id, language_code, interpretation_type, interpretation_url, interpretation_data) 
SELECT 
  id,
  'asl',
  'video',
  '/sign-language/asl/' || REPLACE(LOWER(title), ' ', '-') || '.mp4',
  '{"duration": 120, "quality": "hd", "captions": true}'
FROM learning_content;
