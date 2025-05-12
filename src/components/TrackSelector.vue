<template>
  <div class="at-sidebar-content">
    <div class="at-track-list">
      <div
        v-for="track in tracks"
        :key="track.index"
        class="at-track"
        :class="{ active: isActive(track) }"
        @click="selectTrack(track)"
      >
        <div class="at-track-icon">
          <!-- Placeholder for icon, e.g. from FontAwesome -->
          <i :class="getTrackIcon(track)"></i>
        </div>
        <div class="at-track-details">
          <div class="at-track-name">{{ track.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  tracks: {
    type: Array,
    required: true,
    default: () => []
  },
  activeTrackIndices: {
    type: Set, // Using a Set for efficient lookup of active track indices
    required: true,
    default: () => new Set()
  }
});

const emit = defineEmits(['track-selected']);

function selectTrack(track) {
  emit('track-selected', track);
}

function isActive(track) {
  return props.activeTrackIndices.has(track.index);
}

// Basic icon mapping, can be expanded
function getTrackIcon(track) {
  // This is a very basic example. You might want to map program numbers
  // or instrument names to specific FontAwesome icons.
  // For now, a generic music icon or guitar icon.
  if (track.program >= 24 && track.program <= 31) { // Guitar family
    return 'fas fa-guitar';
  }
  if (track.program >= 32 && track.program <= 39) { // Bass family
    return 'fas fa-guitar'; // Using guitar icon for bass too, or find a bass specific one
  }
  if (track.program >= 0 && track.program <= 7) { // Piano family
    return 'fas fa-piano'; // Placeholder, FontAwesome might not have 'fa-piano' by default
  }
  if (track.isPercussion) {
    return 'fas fa-drum';
  }
  return 'fas fa-music'; // Default icon
}
</script>

<style scoped>
/* Styles adapted from the provided HTML */
.at-sidebar-content {
  width: 100%; /* Ensure it fills the sidebar */
}

.at-track-list {
  /* No specific styles needed for the list container itself from the example,
     but you can add padding or other layout styles if necessary */
}

.at-track {
  display: flex;
  position: relative;
  padding: 5px;
  transition: background 0.2s;
  cursor: pointer;
  align-items: center; /* Vertically align icon and details */
  width: 100%; /* Ensure track items take full width of expanded sidebar */
  box-sizing: border-box; /* Include padding in width calculation */
}

.at-track:hover {
  background: rgba(0, 0, 0, 0.1);
}

.at-track > .at-track-icon,
.at-track > .at-track-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.at-track > .at-track-icon {
  flex-shrink: 0;
  font-size: 28px; /* Slightly smaller to fit better */
  opacity: 0.5;
  transition: opacity 0.2s;
  width: 60px; /* Fixed width for icon area */
  height: 60px; /* Fixed height for icon area */
  margin-right: 5px;
  align-items: center;
  text-align: center; /* Center icon horizontally */
}

.at-track-details {
  overflow: hidden; /* Prevent long names from breaking layout */
  white-space: nowrap;
  text-overflow: ellipsis;
  flex-grow: 1; /* Allow details to take remaining space */
}

.at-track-name {
  font-weight: 500; /* Changed from bold to 500 as per example */
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.at-track:hover > .at-track-icon {
  opacity: 0.8;
}

.at-track.active {
  background: rgba(0, 0, 0, 0.03);
}

.at-track.active > .at-track-icon {
  color: #4972a1;
  opacity: 1;
}

/* Ensure FontAwesome is loaded in your project's main HTML file or via npm import */
/* e.g. <script src="https://kit.fontawesome.com/your-kit-code.js"></script> in index.html */
/* Or install via npm and import specific icons if using a build system that supports it. */
</style>
