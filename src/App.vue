<script setup>
import { ref, onMounted } from "vue";
import AddTaskDialog from "./components/AddTaskDialog.vue";
import EditTaskDialog from "./components/EditTaskDialog.vue";
import TasksList from "./components/TasksList.vue";

// Tasks array
const tasks = ref([]);

// Dialog visibility
const showAddDialog = ref(false);
const showEditDialog = ref(false);

// Selected task for editing
const selectedTask = ref(null);

// Load tasks from localStorage
onMounted(() => {
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.value = storedTasks.map((task) => ({
    ...task,
    priority:
      typeof task.priority === "object" ? task.priority.value : task.priority,
  }));
});

// Add new task
const addTask = (task) => {
  tasks.value.push(task);
  saveTasks();
};

// Open Edit Dialog
const openEditDialog = (task) => {
  selectedTask.value = { ...task };
  showEditDialog.value = true;
};

const saveTasks = () => {
  console.log("Saving tasks to localStorage:", tasks.value);
  localStorage.setItem("tasks", JSON.stringify(tasks.value));
};

const updateTask = (updatedTask) => {
  const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
  if (index !== -1) {
    tasks.value[index] = { ...updatedTask }; // clone to ensure reactivity
    saveTasks();
    console.log("Updated task:", updatedTask);
  }
};
</script>

<template>
  <div
    class="min-h-screen bg-gray-900 text-white overflow-x-hidden flex justify-between"
  >
    <div>
      <div class="flex justify-between items-center px-4 pt-5 pb-3">
        <h2 class="text-xl font-bold mb-4">To Do List App</h2>
        <button
          @click="showAddDialog = true"
          class="bg-blue-500 px-3 py-1 text-[14px] rounded"
        >
          Add Task
        </button>
      </div>
      <hr class="pt-3">

      <div class="-translate-x-[14px] w-[100vw]">
        <TasksList
          :tasks="tasks"
          @update-tasks="tasks = $event"
          @edit-task="openEditDialog"
        />
      </div>
    </div>

    <!-- Add Task Dialog -->
    <AddTaskDialog v-model:visible="showAddDialog" @add-task="addTask" />

    <!-- Edit Task Dialog -->
    <EditTaskDialog
      v-if="selectedTask"
      v-model:visible="showEditDialog"
      :task="selectedTask"
      @update-task="updateTask"
    />
  </div>
</template>
