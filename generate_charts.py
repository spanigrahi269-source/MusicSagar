"""
Generate Feature Completeness Bar Chart and Performance Metrics Bar Chart
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

OUT = r'C:\Users\hp\Documents\a\b'

# ─────────────────────────────────────────────────────────────────────────────
# CHART 1: FEATURE COMPLETENESS
# ─────────────────────────────────────────────────────────────────────────────
features = [
    'User Registration & Login',
    'JWT Authentication (bcrypt)',
    'YouTube Music Search',
    '30-Key API Rotation',
    '12-Hour Search Cache',
    'Playlist CRUD',
    'Listening History',
    'Like / Unlike Songs',
    'Offline Bookmarking',
    'Trending Songs',
    'Mood-Based Discovery',
    'Personalized Recommendations',
    'Analytics Dashboard',
    'Voice Search (Web Speech API)',
    'Social Sharing (6 Platforms)',
    'Karaoke Mode',
    'Mini Player + Queue',
    'Dark / Light Theme',
    'Onboarding Flow (6 Steps)',
    'Related Artists Section',
]

completeness = [100] * 20

# Color gradient: dark blue → medium blue → teal
colors = []
for i in range(20):
    t = i / 19
    r = int(0x1F + t * (0x2E - 0x1F))
    g = int(0x4E + t * (0xA0 - 0x4E))
    b = int(0x79 + t * (0x80 - 0x79))
    colors.append(f'#{r:02X}{g:02X}{b:02X}')

fig, ax = plt.subplots(figsize=(16, 12))
fig.patch.set_facecolor('#F8F9FA')
ax.set_facecolor('#F8F9FA')

y_pos = np.arange(len(features))
bars = ax.barh(y_pos, completeness, color=colors, height=0.65,
               edgecolor='white', linewidth=1.2)

# Value labels inside bars
for bar, val in zip(bars, completeness):
    ax.text(val - 2, bar.get_y() + bar.get_height()/2,
            f'{val}%', ha='right', va='center',
            fontsize=11, fontweight='bold', color='white')

# Feature labels
ax.set_yticks(y_pos)
ax.set_yticklabels(features, fontsize=11.5)
ax.set_xlim(0, 115)
ax.set_xlabel('Completion (%)', fontsize=13, fontweight='bold', color='#333')
ax.xaxis.set_tick_params(labelsize=11)

# Grid
ax.xaxis.grid(True, linestyle='--', alpha=0.4, color='#aaa')
ax.set_axisbelow(True)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color('#ccc')
ax.spines['bottom'].set_color('#ccc')

# 100% reference line
ax.axvline(x=100, color='#C00000', linestyle='--', linewidth=1.8, alpha=0.7)
ax.text(101, 19.6, '100% Target', fontsize=10, color='#C00000',
        fontweight='bold', va='top')

# Summary badge
ax.text(107, 10, '20 / 20\nFeatures\nComplete', ha='center', va='center',
        fontsize=13, fontweight='bold', color='white',
        bbox=dict(boxstyle='round,pad=0.6', fc='#1F4E79', ec='#1F4E79', lw=2))

ax.set_title('Feature Completeness — Music Streaming System',
             fontsize=17, fontweight='bold', color='#1F4E79', pad=18)

plt.tight_layout(pad=1.5)
plt.savefig(fr'{OUT}\Feature_Completeness.png', dpi=200, bbox_inches='tight',
            facecolor='#F8F9FA')
plt.close()
print('Feature Completeness chart saved.')

# ─────────────────────────────────────────────────────────────────────────────
# CHART 2: PERFORMANCE METRICS — Actual vs Target
# ─────────────────────────────────────────────────────────────────────────────
metrics = [
    'Fresh Search\nResponse Time',
    'Cached Search\nResponse Time',
    'Login / JWT\nGeneration',
    'Playlist\nCreation',
    'History Fetch\n(50 records)',
    'Analytics\nQuery',
    'API Cache Hit\nRate Reduction',
    'Daily Quota\nCapacity (k units)',
    'API Key\nFailover Time',
]

# Actual values (normalized for display — all in ms except last two)
actual_vals  = [2000, 50,  300, 200, 150, 200, 80,  300, 100]
target_vals  = [5000, 100, 500, 500, 200, 500, 70,  100, 200]
units        = ['ms', 'ms', 'ms', 'ms', 'ms', 'ms', '%', 'k', 'ms']
actual_disp  = ['2.0s', '50ms', '300ms', '200ms', '150ms', '200ms', '~80%', '300k', '<100ms']
target_disp  = ['5.0s', '100ms', '500ms', '500ms', '200ms', '500ms', '>70%', '>100k', '<200ms']

x = np.arange(len(metrics))
width = 0.35

fig, ax = plt.subplots(figsize=(18, 10))
fig.patch.set_facecolor('#F8F9FA')
ax.set_facecolor('#F8F9FA')

bars1 = ax.bar(x - width/2, actual_vals, width, label='Actual',
               color='#1F4E79', edgecolor='white', linewidth=1.2, zorder=3)
bars2 = ax.bar(x + width/2, target_vals, width, label='Target',
               color='#70AD47', edgecolor='white', linewidth=1.2, zorder=3,
               alpha=0.85)

# Value labels on top of bars
for bar, disp in zip(bars1, actual_disp):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 60,
            disp, ha='center', va='bottom',
            fontsize=10, fontweight='bold', color='#1F4E79')

for bar, disp in zip(bars2, target_disp):
    ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 60,
            disp, ha='center', va='bottom',
            fontsize=10, fontweight='bold', color='#375623')

# ACHIEVED badges
for i, (a, t) in enumerate(zip(actual_vals, target_vals)):
    # For most metrics lower is better; for quota/cache higher is better
    achieved = (a <= t) if i not in [6, 7] else (a >= t)
    badge_color = '#1F4E79' if achieved else '#C00000'
    badge_text  = 'ACHIEVED' if achieved else 'PENDING'
    ax.text(x[i], -420, badge_text, ha='center', va='center',
            fontsize=8.5, fontweight='bold', color='white',
            bbox=dict(boxstyle='round,pad=0.3', fc=badge_color, ec='none'))

ax.set_xticks(x)
ax.set_xticklabels(metrics, fontsize=11, ha='center')
ax.set_ylabel('Value (ms / % / k units)', fontsize=13, fontweight='bold', color='#333')
ax.yaxis.set_tick_params(labelsize=11)
ax.set_ylim(-600, 6000)

ax.yaxis.grid(True, linestyle='--', alpha=0.4, color='#aaa')
ax.set_axisbelow(True)
ax.spines['top'].set_visible(False)
ax.spines['right'].set_visible(False)
ax.spines['left'].set_color('#ccc')
ax.spines['bottom'].set_color('#ccc')

legend = ax.legend(fontsize=12, framealpha=0.9, edgecolor='#ccc',
                   loc='upper right',
                   handles=[
                       mpatches.Patch(color='#1F4E79', label='Actual Value'),
                       mpatches.Patch(color='#70AD47', label='Target Value'),
                   ])

ax.set_title('Performance Metrics — Actual vs Target',
             fontsize=17, fontweight='bold', color='#1F4E79', pad=18)

# Note
ax.text(0.5, -0.13,
        'Note: Cache Hit Rate and Daily Quota — higher is better. All other metrics — lower is better.',
        transform=ax.transAxes, ha='center', fontsize=10,
        color='#666', style='italic')

plt.tight_layout(pad=1.5)
plt.savefig(fr'{OUT}\Performance_Metrics.png', dpi=200, bbox_inches='tight',
            facecolor='#F8F9FA')
plt.close()
print('Performance Metrics chart saved.')
print(f'\nBoth charts saved to: {OUT}')
