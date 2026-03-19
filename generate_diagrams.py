"""
Generate ER Diagram and System Architecture Diagram - Clean, Large, Readable
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch
import numpy as np

OUT = r'C:\Users\hp\Documents\a\b'

# ─────────────────────────────────────────────────────────────────────────────
# SYSTEM ARCHITECTURE DIAGRAM  (vertical flow, top to bottom)
# ─────────────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(20, 26))
ax.set_xlim(0, 20)
ax.set_ylim(0, 26)
ax.axis('off')
fig.patch.set_facecolor('#F8F9FA')

def rbox(ax, x, y, w, h, title, subs=[], 
         fc='#1F4E79', tc='white', ec=None, title_size=13, sub_size=10.5, radius=0.4):
    ec = ec or fc
    patch = FancyBboxPatch((x, y), w, h,
                            boxstyle=f"round,pad=0.15",
                            linewidth=2.5, edgecolor=ec, facecolor=fc,
                            zorder=3)
    ax.add_patch(patch)
    total = len(subs)
    ty = y + h - 0.45 if total else y + h/2
    ax.text(x + w/2, ty, title, ha='center', va='center',
            fontsize=title_size, fontweight='bold', color=tc, zorder=4)
    for i, s in enumerate(subs):
        sy = y + h - 0.9 - i * 0.52
        ax.text(x + w/2, sy, s, ha='center', va='center',
                fontsize=sub_size, color=tc, alpha=0.92, zorder=4)

def section_bg(ax, x, y, w, h, label, color):
    patch = FancyBboxPatch((x, y), w, h,
                            boxstyle="round,pad=0.2",
                            linewidth=2.5, edgecolor=color,
                            facecolor=color + '18', zorder=1, linestyle='--')
    ax.add_patch(patch)
    ax.text(x + w/2, y + h + 0.15, label, ha='center', va='bottom',
            fontsize=12, fontweight='bold', color=color, zorder=2)

def arrow(ax, x1, y1, x2, y2, label='', color='#444444', lw=2.5):
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='->', color=color, lw=lw,
                                mutation_scale=22),
                zorder=5)
    if label:
        mx, my = (x1+x2)/2, (y1+y2)/2
        ax.text(mx + 0.15, my, label, fontsize=9.5, color=color,
                style='italic', fontweight='bold', zorder=6,
                bbox=dict(boxstyle='round,pad=0.2', fc='white', ec='none', alpha=0.8))

def darrow(ax, x1, y1, x2, y2, color='#444444', lw=2.5):
    """Double-headed arrow"""
    ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                arrowprops=dict(arrowstyle='<->', color=color, lw=lw,
                                mutation_scale=22), zorder=5)

# ── Title ─────────────────────────────────────────────────────────────────────
ax.text(10, 25.3, 'System Architecture — Music Streaming System',
        ha='center', va='center', fontsize=20, fontweight='bold',
        color='#1F4E79',
        bbox=dict(boxstyle='round,pad=0.4', fc='#D6E4F0', ec='#1F4E79', lw=2))

# ══════════════════════════════════════════════════════════════════════════════
# ROW 1 — Three Tiers side by side
# ══════════════════════════════════════════════════════════════════════════════

# ── TIER 1: Frontend (left) ───────────────────────────────────────────────────
section_bg(ax, 0.4, 16.2, 5.8, 7.8, 'TIER 1 — Presentation Layer', '#2E74B5')

rbox(ax, 0.8, 22.2, 5.0, 1.4, 'Browser — React.js SPA',
     ['Built with Vite  |  Port 5173'],
     fc='#2E74B5', title_size=13)

# Component boxes
comp_data = [
    ('Home Page',    'Recommendations + Trending'),
    ('Search Page',  'Cache + Voice + Language Filter'),
    ('Player',       'Mini Player + Full Screen + Karaoke'),
    ('Playlists',    'Create / Edit / Delete'),
    ('Analytics',    'Stats + Charts'),
    ('Mood / Offline','Slider + Bookmarks'),
]
for i, (name, sub) in enumerate(comp_data):
    r, c = divmod(i, 2)
    rbox(ax, 0.8 + c*2.55, 21.0 - r*1.35, 2.35, 1.15, name, [sub],
         fc='#5B9BD5', title_size=10, sub_size=8.5)

rbox(ax, 0.8, 16.5, 5.0, 0.9, 'Axios HTTP Client',
     ['JWT Bearer Token Interceptor  |  Base URL: localhost:8000'],
     fc='#1F4E79', title_size=10, sub_size=8.5)

# ── TIER 2: Backend (center) ──────────────────────────────────────────────────
section_bg(ax, 7.1, 16.2, 5.8, 7.8, 'TIER 2 — Application Layer', '#1F4E79')

rbox(ax, 7.5, 22.2, 5.0, 1.4, 'FastAPI Application',
     ['uvicorn ASGI Server  |  Port 8000  |  Python 3.10+'],
     fc='#1F4E79', title_size=13)

router_data = [
    ('/auth',      'JWT + bcrypt Auth'),
    ('/youtube',   '30-Key Rotation'),
    ('/playlists', 'CRUD Operations'),
    ('/history',   'Play Tracking'),
    ('/stats',     'Recs + Analytics'),
    ('/offline',   'Bookmarks'),
]
for i, (name, sub) in enumerate(router_data):
    r, c = divmod(i, 2)
    rbox(ax, 7.5 + c*2.55, 21.0 - r*1.35, 2.35, 1.15, name, [sub],
         fc='#2E74B5', title_size=10.5, sub_size=8.5)

rbox(ax, 7.5, 16.5, 5.0, 0.9, 'SQLAlchemy ORM  +  Pydantic Schemas',
     ['Models: User, Song, Playlist, History, Like, OfflineSong'],
     fc='#1a1a6e', title_size=10, sub_size=8.5)

# ── TIER 3: Database (right) ──────────────────────────────────────────────────
section_bg(ax, 13.8, 16.2, 5.8, 7.8, 'TIER 3 — Data Layer', '#375623')

rbox(ax, 14.2, 22.2, 5.0, 1.4, 'SQLite Database',
     ['music_sagar.db  |  File-based  |  SQLAlchemy'],
     fc='#375623', title_size=13)

table_data = [
    ('users',         'id, username, email\nhashed_password, theme'),
    ('songs',         'id, youtube_video_id\ntitle, thumbnail, channel'),
    ('playlists',     'id, name, user_id (FK)'),
    ('playlist_songs','playlist_id (FK)\nsong_id (FK)'),
    ('history',       'user_id (FK), song_id (FK)\nplayed_at'),
    ('likes / offline','user_id (FK), song_id (FK)\ncreated_at / saved_at'),
]
for i, (name, sub) in enumerate(table_data):
    r, c = divmod(i, 2)
    rbox(ax, 14.2 + c*2.55, 21.0 - r*1.35, 2.35, 1.15, name, [sub],
         fc='#538135', title_size=10, sub_size=8, tc='white')

rbox(ax, 14.2, 16.5, 5.0, 0.9, 'Shared Song Records',
     ['youtube_video_id UNIQUE — prevents duplicates across users'],
     fc='#375623', title_size=10, sub_size=8.5)

# ══════════════════════════════════════════════════════════════════════════════
# ROW 2 — localStorage + YouTube API
# ══════════════════════════════════════════════════════════════════════════════

rbox(ax, 0.4, 12.8, 5.8, 2.8, 'localStorage (Browser Storage)',
     ['JWT Token — persists login session',
      'Search Cache — 12h, 200 entries, LRU eviction',
      'Recent Searches — last 5 queries',
      'Onboarding State — first-time user flag'],
     fc='#7F6000', title_size=12, sub_size=9.5)

rbox(ax, 7.1, 12.8, 12.5, 2.8, 'YouTube Data API v3  (External Service — Google Cloud)',
     ['30 API Keys: YOUTUBE_API_KEY_1 to YOUTUBE_API_KEY_30  |  300,000 quota units / day',
      '/youtube/v3/search  — 100 units per call  |  Returns 20 results  |  Language filter  |  Pagination via pageToken',
      '/youtube/v3/videos  — 1 unit per video  |  Fetches ISO 8601 duration  |  3-second async timeout'],
     fc='#C00000', title_size=12, sub_size=9.5)

# ══════════════════════════════════════════════════════════════════════════════
# ARROWS
# ══════════════════════════════════════════════════════════════════════════════

# Tier1 ↔ Tier2
darrow(ax, 5.8, 19.5, 7.5, 19.5, '#1F4E79', 2.5)
ax.text(6.65, 19.75, 'REST API\n(JSON)', ha='center', fontsize=9,
        fontweight='bold', color='#1F4E79',
        bbox=dict(boxstyle='round,pad=0.3', fc='#D6E4F0', ec='#1F4E79', lw=1.5))

# Tier2 ↔ Tier3
darrow(ax, 12.5, 19.5, 14.2, 19.5, '#375623', 2.5)
ax.text(13.35, 19.75, 'SQLAlchemy\nORM', ha='center', fontsize=9,
        fontweight='bold', color='#375623',
        bbox=dict(boxstyle='round,pad=0.3', fc='#E2EFDA', ec='#375623', lw=1.5))

# Tier1 → localStorage
arrow(ax, 3.3, 16.2, 3.3, 15.6, '', '#7F6000', 2.5)

# Tier2 → YouTube
arrow(ax, 10.0, 16.2, 10.0, 15.6, '', '#C00000', 2.5)
arrow(ax, 10.0, 12.8, 10.0, 16.2, '', '#C00000', 2.5)
ax.text(10.3, 14.5, 'HTTPX\nasync', ha='left', fontsize=9,
        fontweight='bold', color='#C00000',
        bbox=dict(boxstyle='round,pad=0.3', fc='#FFE0E0', ec='#C00000', lw=1.5))

plt.tight_layout(pad=1.0)
plt.savefig(fr'{OUT}\System_Architecture.png', dpi=200, bbox_inches='tight',
            facecolor='#F8F9FA', edgecolor='none')
plt.close()
print('System Architecture saved.')

# ─────────────────────────────────────────────────────────────────────────────
# ER DIAGRAM  — clean, large, well-spaced
# ─────────────────────────────────────────────────────────────────────────────
fig, ax = plt.subplots(figsize=(22, 16))
ax.set_xlim(0, 22)
ax.set_ylim(0, 16)
ax.axis('off')
fig.patch.set_facecolor('#F8F9FA')

COLORS = {
    'header': '#1F4E79',
    'pk_row':  '#D6E4F0',
    'fk_row':  '#E2EFDA',
    'row':     '#F2F2F2',
    'border':  '#2E74B5',
    'line':    '#555555',
    'title':   '#1F4E79',
}

def er_entity(ax, x, y, name, attrs):
    """attrs = list of (field_name, type_str, 'PK'|'FK'|'')"""
    col_w = 3.8
    row_h = 0.52
    header_h = 0.65
    total_h = header_h + len(attrs) * row_h

    # Header
    hdr = FancyBboxPatch((x, y + total_h - header_h), col_w, header_h,
                          boxstyle="round,pad=0.05", lw=2,
                          edgecolor=COLORS['header'], facecolor=COLORS['header'], zorder=3)
    ax.add_patch(hdr)
    ax.text(x + col_w/2, y + total_h - header_h/2, name,
            ha='center', va='center', fontsize=12, fontweight='bold',
            color='white', zorder=4)

    # Attribute rows
    for i, (field, dtype, key) in enumerate(attrs):
        ry = y + total_h - header_h - (i+1)*row_h
        fc = COLORS['pk_row'] if key == 'PK' else (COLORS['fk_row'] if key == 'FK' else COLORS['row'])
        row_patch = FancyBboxPatch((x, ry), col_w, row_h,
                                    boxstyle="square,pad=0", lw=1,
                                    edgecolor=COLORS['border'], facecolor=fc, zorder=3)
        ax.add_patch(row_patch)
        # Key badge
        if key:
            badge_fc = '#1F4E79' if key == 'PK' else '#375623'
            ax.text(x + 0.18, ry + row_h/2, key,
                    ha='center', va='center', fontsize=7, fontweight='bold',
                    color='white', zorder=5,
                    bbox=dict(boxstyle='round,pad=0.15', fc=badge_fc, ec='none'))
        ax.text(x + 0.42, ry + row_h/2, field,
                ha='left', va='center', fontsize=9.5,
                fontweight='bold' if key == 'PK' else 'normal',
                color='#1a1a2e', zorder=4)
        ax.text(x + col_w - 0.1, ry + row_h/2, dtype,
                ha='right', va='center', fontsize=8.5,
                color='#555555', style='italic', zorder=4)

    return col_w, total_h

def rel(ax, x1, y1, x2, y2, label=''):
    ax.plot([x1, x2], [y1, y2], color=COLORS['line'], lw=2, zorder=2)
    ax.plot(x1, y1, 'o', color=COLORS['line'], ms=6, zorder=3)
    ax.plot(x2, y2, 's', color='#C00000', ms=6, zorder=3)
    if label:
        mx, my = (x1+x2)/2, (y1+y2)/2
        ax.text(mx, my + 0.18, label, ha='center', fontsize=9,
                color='#C00000', fontweight='bold',
                bbox=dict(boxstyle='round,pad=0.2', fc='white', ec='#C00000', lw=1, alpha=0.9))

# ── Place entities ────────────────────────────────────────────────────────────
# users  (left)
er_entity(ax, 0.5, 8.5, 'users', [
    ('id',              'INTEGER', 'PK'),
    ('username',        'VARCHAR', ''),
    ('email',           'VARCHAR', ''),
    ('hashed_password', 'VARCHAR', ''),
    ('created_at',      'DATETIME',''),
    ('theme',           'VARCHAR', ''),
])

# songs  (center-top)
er_entity(ax, 9.1, 10.5, 'songs', [
    ('id',               'INTEGER', 'PK'),
    ('youtube_video_id', 'VARCHAR', ''),
    ('title',            'VARCHAR', ''),
    ('thumbnail',        'VARCHAR', ''),
    ('channel',          'VARCHAR', ''),
])

# playlists  (right)
er_entity(ax, 17.7, 10.5, 'playlists', [
    ('id',      'INTEGER', 'PK'),
    ('name',    'VARCHAR', ''),
    ('user_id', 'INTEGER', 'FK'),
])

# playlist_songs  (center)
er_entity(ax, 13.4, 6.8, 'playlist_songs', [
    ('id',          'INTEGER', 'PK'),
    ('playlist_id', 'INTEGER', 'FK'),
    ('song_id',     'INTEGER', 'FK'),
])

# history  (bottom-left)
er_entity(ax, 0.5, 3.5, 'history', [
    ('id',        'INTEGER',  'PK'),
    ('user_id',   'INTEGER',  'FK'),
    ('song_id',   'INTEGER',  'FK'),
    ('played_at', 'DATETIME', ''),
])

# likes  (bottom-center)
er_entity(ax, 6.5, 3.5, 'likes', [
    ('id',         'INTEGER',  'PK'),
    ('user_id',    'INTEGER',  'FK'),
    ('song_id',    'INTEGER',  'FK'),
    ('created_at', 'DATETIME', ''),
])

# offline_songs  (bottom-right)
er_entity(ax, 12.5, 3.5, 'offline_songs', [
    ('id',       'INTEGER',  'PK'),
    ('user_id',  'INTEGER',  'FK'),
    ('song_id',  'INTEGER',  'FK'),
    ('saved_at', 'DATETIME', ''),
])

# ── Relationships ─────────────────────────────────────────────────────────────
# users → playlists (via user_id FK)
rel(ax, 4.3, 11.5, 17.7, 11.5, '1 : N')
# users → history
rel(ax, 2.4, 8.5, 2.4, 5.6, '1 : N')
# users → likes
rel(ax, 4.3, 10.5, 6.5, 5.6, '1 : N')
# users → offline_songs
rel(ax, 4.3, 9.5, 12.5, 5.6, '1 : N')
# songs → history
rel(ax, 9.1, 11.5, 4.3, 5.6, '1 : N')
# songs → likes
rel(ax, 9.1, 11.0, 8.3, 5.6, '1 : N')
# songs → offline_songs
rel(ax, 12.9, 11.0, 14.3, 5.6, '1 : N')
# songs → playlist_songs
rel(ax, 12.9, 11.5, 15.2, 8.9, '1 : N')
# playlists → playlist_songs
rel(ax, 19.6, 10.5, 17.2, 8.9, '1 : N')

# ── Legend ────────────────────────────────────────────────────────────────────
legend_x, legend_y = 0.5, 1.2
ax.add_patch(FancyBboxPatch((legend_x, legend_y), 6.5, 1.8,
                             boxstyle="round,pad=0.1", lw=1.5,
                             edgecolor='#888', facecolor='white', zorder=3))
ax.text(legend_x + 3.25, legend_y + 1.55, 'Legend', ha='center',
        fontsize=11, fontweight='bold', color='#333', zorder=4)
for i, (badge, label, fc) in enumerate([
    ('PK', 'Primary Key', '#1F4E79'),
    ('FK', 'Foreign Key', '#375623'),
]):
    bx = legend_x + 0.3 + i*3.2
    ax.text(bx, legend_y + 0.95, badge, ha='center', va='center',
            fontsize=9, fontweight='bold', color='white', zorder=5,
            bbox=dict(boxstyle='round,pad=0.25', fc=fc, ec='none'))
    ax.text(bx + 0.5, legend_y + 0.95, label, ha='left', va='center',
            fontsize=10, color='#333', zorder=4)
ax.plot([legend_x+0.3], [legend_y+0.45], 'o', color=COLORS['line'], ms=8, zorder=4)
ax.text(legend_x+0.6, legend_y+0.45, '= One side', ha='left', va='center', fontsize=10)
ax.plot([legend_x+3.5], [legend_y+0.45], 's', color='#C00000', ms=8, zorder=4)
ax.text(legend_x+3.8, legend_y+0.45, '= Many side', ha='left', va='center', fontsize=10)

ax.set_title('Entity Relationship Diagram — Music Streaming System',
             fontsize=17, fontweight='bold', color=COLORS['title'], pad=16)

plt.tight_layout(pad=1.0)
plt.savefig(fr'{OUT}\ER_Diagram.png', dpi=200, bbox_inches='tight',
            facecolor='#F8F9FA', edgecolor='none')
plt.close()
print('ER Diagram saved.')
print(f'\nBoth diagrams saved to: {OUT}')
