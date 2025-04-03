<script setup>
import { defineProps, watch } from "vue";
import { formatDate } from "@/utils/formatDateTime";
import { CalendarIcon, CheckIcon, BackwardIcon } from "@heroicons/vue/24/solid";

const props = defineProps(["task", "markAsDone", "deleteTask"]);
</script>

<template>
  <div
    class="p-4 bg-gray-800 rounded-xl shadow-lg border-2 border-gray-700 hover:border-blue-500 transition-all duration-200 -translate-x-[15px] w-[75vw] max-w-[420px]"
  >
    <div class="flex justify-between items-center mb-2">
      <span class="text-lg font-semibold text-white">
        {{ task.label }}
      </span>
      <span
        class="text-xs font-semibold px-2 py-1 rounded-full"
        :class="{
          'bg-green-500 text-white': task.priority === 'Low',
          'bg-yellow-500 text-white': task.priority === 'Medium',
          'bg-red-500 text-white': task.priority === 'High',
        }"
      >
        {{ task.priority }}
      </span>
    </div>

    <div class="flex items-center text-gray-400 text-sm space-x-2">
      <CalendarIcon class="w-4 h-4 text-blue-400" />
      <span>{{ formatDate(task.dueDate) }}</span>
    </div>

    <div class="flex justify-end mt-3 space-x-2">
      <button
        class="px-3 py-1 text-xs font-semibold rounded-md bg-red-600 hover:bg-red-500 text-white transition-all duration-200"
        @click="deleteTask(task)"
      >
        Delete
      </button>
      <button
        class="px-3 py-1 rounded-md flex items-center gap-2 text-xs transition-all duration-200"
        :class="
          task.done
            ? 'bg-yellow-500 hover:bg-yellow-600'
            : 'bg-green-500 hover:bg-green-600 text-white'
        "
        @click="markAsDone(task)"
      >
        <CheckIcon v-if="!task.done" class="w-3 h-3" />
        <BackwardIcon v-if="task.done" class="w-3 h-3" />
        {{ task.done ? "Undo" : "Done" }}
      </button>
    </div>
  </div>
</template>
