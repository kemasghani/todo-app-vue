<script setup>
import { defineProps, defineEmits } from "vue";
import { formatDate } from "@/utils/formatDateTime";
import { CalendarIcon, CheckIcon, BackwardIcon } from "@heroicons/vue/24/solid";

const props = defineProps(["task", "markAsDone", "deleteTask"]);
const emit = defineEmits(["editTask"]);

const handleEditClick = (e) => {
  e.stopPropagation();
  emit("editTask", props.task);
};
</script>

<template>
  <div
    class="p-4 bg-gray-800 rounded-xl shadow-lg border-2 border-gray-700 hover:border-blue-500 transition-all duration-200 -translate-x-[15px] w-[100%] cursor-pointer"
    @click="emit('editTask', task)"
  >
    <div class="flex justify-between items-center mb-2">
      <span class="text-lg font-semibold text-white">
        {{ task.label }}
      </span>
      <div class="flex items-center gap-2">
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
        <span class="editIcon" @click="handleEditClick">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6"
          >
            <path
              d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"
            />
            <path
              d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"
            />
          </svg>
        </span>
      </div>
    </div>

    <div class="flex items-center text-gray-400 text-sm space-x-2">
      <CalendarIcon class="w-4 h-4 text-blue-400" />
      <span>{{ formatDate(task.dueDate) }}</span>
    </div>

    <div class="flex justify-end mt-3 space-x-2">
      <button
        class="px-3 py-1 text-xs font-semibold rounded-md bg-red-600 hover:bg-red-500 text-white transition-all duration-200"
        @click.stop="deleteTask(task, $event)"
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
        @click.stop="markAsDone(task)"
      >
        <CheckIcon v-if="!task.done" class="w-3 h-3" />
        <BackwardIcon v-if="task.done" class="w-3 h-3" />
        {{ task.done ? "Undo" : "Done" }}
      </button>
    </div>
  </div>
</template>

<style>
.editIcon svg {
  color: white;
  fill: white;
  width: 15px;
  height: 15px;
}
</style>
