# yt-dlp + Whisper for Competitor Research

> **Time:** ~2h (one-time setup, then minutes per research run)
> **Stack:** Python 3.12, uv, yt-dlp, faster-whisper (local), Claude API
> **Used in:** [YouTube Pipeline](../case-studies/youtube-pipeline.md), the content side of every brand the operator runs

## The problem

You want to research a niche on YouTube. You need to know what the top creators are saying, what hooks they use, what topics they cover, what they avoid. Watching 20 videos is hours. Letting a cloud transcription service eat your unreleased footage and your competitors' content costs money and leaks data.

This recipe pulls N videos for a query, transcribes them locally, and turns the transcripts into a research brief Claude can summarize. Zero cloud cost, runs offline, and the transcripts stay on your machine.

## Solution overview

`yt-dlp` pulls video subtitles (auto-generated if uploaded captions are missing), `faster-whisper` cleans them up or generates from audio when subs are bad, and a small script feeds the result into Claude with a research-brief prompt.

The whole thing is a 50-line Python script plus configuration. It runs on a laptop CPU; GPU is faster but not required for short videos.

## Step-by-step

### 1. Install

```bash
uv init research && cd research
uv add yt-dlp faster-whisper anthropic
brew install ffmpeg     # required by both yt-dlp and whisper
```

`faster-whisper` is a CTranslate2 reimplementation of Whisper that runs ~4x faster than the reference `openai-whisper` on CPU and uses less memory.

### 2. Pull video metadata for a query

```python
# search.py
import yt_dlp

def search_videos(query: str, n: int = 10) -> list[dict]:
    opts = {
        "quiet": True,
        "extract_flat": True,
        "default_search": f"ytsearch{n}",
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        result = ydl.extract_info(query, download=False)
        return result.get("entries", [])

if __name__ == "__main__":
    import sys
    for v in search_videos(sys.argv[1], int(sys.argv[2])):
        print(v["id"], v["title"], v.get("view_count"))
```

```bash
uv run python search.py "used car dealer marketing" 20
```

You get IDs, titles, view counts. No videos downloaded yet.

### 3. Download audio + auto-subs

```python
# fetch.py
import yt_dlp
from pathlib import Path

OUT = Path("./downloads")
OUT.mkdir(exist_ok=True)

def fetch_one(video_id: str) -> dict:
    opts = {
        "format": "bestaudio/best",
        "outtmpl": str(OUT / f"{video_id}.%(ext)s"),
        "writesubtitles": True,
        "writeautomaticsub": True,
        "subtitleslangs": ["en", "es"],
        "subtitlesformat": "vtt",
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "128",
        }],
        "quiet": True,
    }
    with yt_dlp.YoutubeDL(opts) as ydl:
        return ydl.extract_info(f"https://youtu.be/{video_id}", download=True)
```

This pulls audio (mp3, 128kbps) and any available subs in the requested languages. Auto-subs are messy — capitalization missing, no punctuation — but for research that is fine.

### 4. Transcribe when subs are bad

```python
# transcribe.py
from faster_whisper import WhisperModel
from pathlib import Path

model = WhisperModel("small", device="cpu", compute_type="int8")

def transcribe(audio_path: Path) -> str:
    segments, info = model.transcribe(str(audio_path), language=None)
    return "\n".join(s.text.strip() for s in segments)
```

Model size:

- `tiny` — fastest, decent for English, weak on accents
- `small` — sweet spot for laptop CPU, good multi-lingual
- `medium` — better quality, ~3x slower
- `large-v3` — best quality, GPU recommended

`int8` quantization halves memory and runs ~2x faster on CPU with negligible accuracy loss for research-grade transcripts.

### 5. Build the research brief with Claude

```python
# brief.py
import anthropic
import json
from pathlib import Path

client = anthropic.Anthropic()

PROMPT = """You are researching the YouTube niche "{query}".
Below are transcripts of {n} top videos. Produce a research brief with:

1. Top 5 recurring topics
2. Top 5 hooks used in the first 30 seconds
3. Common formats (interview, listicle, walkthrough, etc.)
4. Topics nobody covers well (gaps)
5. Three concrete video ideas this analysis suggests

Transcripts follow.

{transcripts}
"""

def make_brief(query: str, transcripts: list[dict]) -> str:
    body = "\n\n---\n\n".join(
        f"## {t['title']}\nViews: {t['views']}\n\n{t['text'][:8000]}"
        for t in transcripts
    )
    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": PROMPT.format(
            query=query, n=len(transcripts), transcripts=body,
        )}],
    )
    return msg.content[0].text
```

Truncate each transcript to ~8000 chars so 10 videos fit comfortably under the model's context for a Sonnet-class call. For deeper analysis use Opus and raise the cap.

### 6. Wire it up

```python
# main.py
from search import search_videos
from fetch import fetch_one
from transcribe import transcribe
from brief import make_brief
from pathlib import Path
import sys

query, n = sys.argv[1], int(sys.argv[2]) if len(sys.argv) > 2 else 10
transcripts = []
for v in search_videos(query, n):
    fetch_one(v["id"])
    text = transcribe(Path(f"downloads/{v['id']}.mp3"))
    transcripts.append({"title": v["title"], "views": v.get("view_count", 0), "text": text})

brief = make_brief(query, transcripts)
Path(f"briefs/{query.replace(' ', '_')}.md").write_text(brief)
print(brief)
```

```bash
uv run python main.py "used car dealer marketing" 10
```

~5 minutes per run on a laptop CPU for 10 videos at the `small` model.

## Pitfalls

- **YouTube blocking yt-dlp.** YouTube tightens `yt-dlp` periodically. Always pin to a recent version: `uv add 'yt-dlp>=<verify before shipping>'`. If downloads start 403-ing, run `uv add yt-dlp@latest`.
- **Whisper hallucinating on silence.** Long stretches of silence get transcribed as repeated phrases ("thank you for watching", "subscribe to my channel"). Pass `vad_filter=True` to `WhisperModel.transcribe()` to skip silent regions.
- **Auto-sub language picking the wrong one.** A bilingual creator's video may have auto-subs in two languages and `yt-dlp` picks one arbitrarily. Filter by `subtitleslangs` and verify before transcribing.
- **Disk fills up.** mp3s plus VTTs add up. Add a cleanup step at the end of the run, or use a `tempfile.TemporaryDirectory` and only keep the transcript text.
- **Treating the brief as truth.** The research brief is a summary of what the creators in your sample chose to make. Survivorship bias is real — your sample is biased toward what YouTube already surfaces. Use the brief as a hypothesis source, not as a market analysis.

## References

- [yt-dlp docs](https://github.com/yt-dlp/yt-dlp)
- [faster-whisper](https://github.com/SYSTRAN/faster-whisper)
- [OpenAI Whisper paper](https://arxiv.org/abs/2212.04356)
- [recipe 12 — turning the brief into platform-native content](12-content-cross-post-pipeline.md)
- [case-studies/youtube-pipeline.md](../case-studies/youtube-pipeline.md)
