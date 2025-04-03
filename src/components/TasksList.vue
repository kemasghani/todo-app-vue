<script setup>
import { ref, onMounted, watch } from "vue";
import Tree from "primevue/tree";
import CardTask from "@/components/CardTask.vue";
import emptyImage from "@/assets/img/empty.svg";
import ConfirmPopup from "primevue/confirmpopup";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

const props = defineProps(["tasks"]);
const emit = defineEmits(["update-tasks"]);

const nodes = ref([]);
const expandedKeys = ref({});
const confirm = useConfirm();
const toast = useToast();

const markAsDone = (task) => {
  const updatedTasks = props.tasks.map((t) => {
    if (t.id === task.key) {
      return { ...t, done: !t.done }; // ✅ Toggle done status
    }
    return t;
  });

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  emit("update-tasks", [...updatedTasks]); // ✅ Force reactivity

  toast.add({
    severity: task.done ? "warn" : "success",
    summary: task.done ? "Task Marked as Pending" : "Completed",
    detail: task.done ? "Task moved back to pending" : "Task marked as done",
    life: 3000,
  });
};

const deleteTask = (task) => {
  confirm.require({
    message: "Are you sure you want to delete this task?",
    icon: "pi pi-info-circle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Delete",
      severity: "danger",
    },
    accept: () => {
      const updatedTasks = props.tasks.filter((t) => t.id !== task.key);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));

      emit("update-tasks", updatedTasks); // Emit event to parent
      toast.add({
        severity: "info",
        summary: "Deleted",
        detail: "Task deleted successfully",
        life: 3000,
      });
    },
    reject: () => {
      toast.add({
        severity: "warn",
        summary: "Cancelled",
        detail: "Task deletion cancelled",
        life: 3000,
      });
    },
  });
};

// Function to update tree structure based on tasks
const updateNodes = () => {
  const today = new Date().setHours(0, 0, 0, 0);
  const todayTasks = [];
  const futureTasks = [];
  const completedTasks = [];

  props.tasks.forEach((task) => {
    const taskDate = new Date(task.dueDate).setHours(0, 0, 0, 0);
    const taskNode = {
      key: task.id,
      label: task.name,
      dueDate: task.dueDate,
      priority: task.priority,
      done: task.done,
      type: "task",
    };

    if (task.done === true) {
      completedTasks.push(taskNode);
    } else if (taskDate === today) {
      todayTasks.push(taskNode);
    } else {
      futureTasks.push(taskNode);
    }
  });

  nodes.value = [
    {
      key: "0",
      label: "Today Task",
      children:
        todayTasks.length > 0
          ? todayTasks
          : [{ key: "0-0", label: "No tasks for today", type: "empty" }],
    },
    {
      key: "1",
      label: "Future Task",
      children:
        futureTasks.length > 0
          ? futureTasks
          : [{ key: "1-0", label: "No future tasks", type: "empty" }],
    },
    {
      key: "2",
      label: "Completed Task",
      children:
        completedTasks.length > 0
          ? completedTasks
          : [{ key: "2-0", label: "No completed tasks", type: "empty" }],
    },
  ];

  nodes.value.forEach((node) => {
    expandedKeys.value[node.key] = true;
  });
};

// Watch for changes in tasks and update nodes reactively
watch(() => props.tasks, updateNodes, { deep: true });

onMounted(() => {
  updateNodes(); // Initialize the task list
});
</script>

<template>
  <div class="card">
    <Toast />
    <ConfirmPopup />
    <Tree
      :value="nodes"
      class="w-[100vw] md:w-[30rem]"
      :expandedKeys="expandedKeys"
    >
      <template #default="slotProps">
        <CardTask
          v-if="slotProps.node.type === 'task'"
          :task="slotProps.node"
          :key="slotProps.node.key"
          :markAsDone="markAsDone"
          :deleteTask="deleteTask"
        />
        <div
          v-else-if="slotProps.node.type === 'empty'"
          class="text-center p-4"
        >
          <img
            :src="emptyImage"
            alt="No tasks"
            class="mx-auto w-24 h-24 mb-2 opacity-70"
          />
          <p class="text-[14px] opacity-55 -translate-y-[20px] font-semibold">
            {{ slotProps.node.label }}
          </p>
        </div>
        <b v-else class="text-white text-lg">{{ slotProps.node.label }}</b>
      </template>
    </Tree>
  </div>
</template>

<style scoped>
.p-tree {
  background: transparent;
  width: 100%;
}
</style>
