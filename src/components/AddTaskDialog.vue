<script setup>
import { ref, watch } from "vue";
import Select from "primevue/select";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";

// Props
const props = defineProps({
  visible: Boolean,
});

// Emits
const emit = defineEmits(["update:visible", "add-task"]);

// Form data
const taskName = ref("");
const dueDate = ref("");
const priority = ref("");
const showError = ref(false);

// Priority options
const priorities = ref([
  { name: "Low", value: "Low" },
  { name: "Medium", value: "Medium" },
  { name: "High", value: "High" },
]);

// Reset form
const resetForm = () => {
  taskName.value = "";
  dueDate.value = "";
  priority.value = "";
  showError.value = false;
};

// Close dialog
const closeDialog = () => {
  emit("update:visible", false);
};

// Add task function
const submitTask = () => {
  if (!taskName.value || !dueDate.value) {
    showError.value = true;
    return;
  }

  emit("add-task", {
    id: Date.now(),
    name: taskName.value,
    dueDate: dueDate.value,
    priority: priority.value,
    done: false,
  });

  closeDialog();
  resetForm();
};

// Watch visibility to reset form on close
watch(
  () => props.visible,
  (newVal) => {
    if (!newVal) resetForm();
  }
);
</script>

<template>
  <Dialog
    v-model:visible="props.visible"
    header="Add Task"
    modal
    :style="{ width: '400px' }"
    @update:visible="emit('update:visible', $event)"
  >
    <form @submit.prevent="submitTask" class="p-4">
      <label class="block text-sm">Task Name</label>
      <InputText
        v-model="taskName"
        data-testid="task-name"
        type="text"
        placeholder="Enter task name"
        class="w-full mt-1"
        autofocus
      />

      <label class="block text-sm mt-3">Due Date</label>
      <input
        data-testid="task-date"
        v-model="dueDate"
        type="datetime-local"
        class="w-full p-2 rounded bg-[#09090b] border-[1px] border-[#71717a] text-white mt-1"
      />

      <label class="block text-sm mt-3">Priority Level</label>
      <Select
        v-model="priority"
        :options="priorities"
        optionLabel="name"
        optionValue="value"
        placeholder="Select priority"
        class="w-full mt-1"
      />

      <p v-if="showError" class="text-red-400 text-sm mt-2">
        Please fill in all required fields.
      </p>

      <div class="flex justify-end mt-4">
        <button
          type="button"
          @click="closeDialog"
          class="bg-gray-600 px-4 py-2 rounded mr-2 text-white hover:bg-gray-700 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-green-500 px-4 py-2 rounded text-white hover:bg-green-600 transition"
        >
          Add
        </button>
      </div>
    </form>
  </Dialog>
</template>

<style>
.p-dialog.p-component {
  background: #18181b;
  border: 1px solid #18181b;
}
.p-dialog {
  color: white !important;
}
.p-select,
.p-inputtext {
  background: black !important;
  border-color: #71717a !important;
}
.p-select-option.p-select-option-selected {
  color: black !important;
}
</style>
