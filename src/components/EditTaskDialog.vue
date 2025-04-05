<script setup>
import { ref, watch } from "vue";
import Select from "primevue/select";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";

// Props
const props = defineProps({
  visible: Boolean,
  task: Object, // incoming task to edit
});

// Emits
const emit = defineEmits(["update:visible", "update-task"]);

// Reactive form fields
const taskName = ref("");
const dueDate = ref("");
const priority = ref("");

// Watch the incoming task and prefill form
watch(
  () => props.task,
  (newTask) => {
    if (newTask) {
      taskName.value = newTask.label;
      dueDate.value = newTask.dueDate;
      priority.value = newTask.priority;
    }
  },
  { immediate: true }
);

// Priority options
const priorities = ref([
  { name: "Low", value: "Low" },
  { name: "Medium", value: "Medium" },
  { name: "High", value: "High" },
]);

// Close dialog
const closeDialog = () => {
  emit("update:visible", false);
};

// ✅ Function to update localStorage by ID
const saveToLocalStorageById = (updatedTask) => {
  console.log(updatedTask);
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  const index = tasks.findIndex((t) => t.id === updatedTask.key);
  if (index !== -1) {
    console.log("adaa");
    tasks[index] = { ...tasks[index], ...updatedTask };
  }
  console.log(JSON.stringify(tasks));
  localStorage.setItem("tasks", JSON.stringify(tasks));
  emit("update-task", tasks);
};

// Submit updated task
const submitEdit = () => {
  if (!taskName.value || !dueDate.value) return;

  const updatedTask = {
    ...props.task,
    name: taskName.value,
    dueDate: dueDate.value,
    priority: priority.value,
  };

  saveToLocalStorageById(updatedTask);
  closeDialog();
};
</script>

<template>
  <Dialog
    v-model:visible="props.visible"
    header="Edit Task"
    modal
    :style="{ width: '400px' }"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="p-4">
      <label class="block text-sm">Task Name</label>
      <InputText
        v-model="taskName"
        type="text"
        placeholder="Edit task name"
        class="w-full mt-1"
      />

      <label class="block text-sm mt-3">Due Date</label>
      <input
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

      <div class="flex justify-end mt-4">
        <button @click="closeDialog" class="bg-gray-600 px-4 py-2 rounded mr-2">
          Cancel
        </button>
        <button @click="submitEdit" class="bg-blue-500 px-4 py-2 rounded">
          Save
        </button>
      </div>
    </div>
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
</style>
