<script setup>
import { ref, onMounted, watch } from "vue";
import Tree from "primevue/tree";
import CardTask from "@/components/CardTask.vue";
import emptyImage from "@/assets/img/empty.svg";
import ConfirmPopup from "primevue/confirmpopup";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";

const props = defineProps(["tasks"]);
const emit = defineEmits(["update-tasks", "edit-task"]);

const nodes = ref([]);
const expandedKeys = ref({});
const confirm = useConfirm();
const toast = useToast();

const showLottie = ref(false); // Declare the state for showing Lottie animation
const todayTasks = ref([]); // Store today's tasks

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
  checkIfAllTodayTasksDone(updatedTasks);
};

const checkIfAllTodayTasksDone = (updatedTasks) => {
  todayTasks.value = updatedTasks.filter(
    (task) =>
      new Date(task.dueDate).setHours(0, 0, 0, 0) ===
        new Date().setHours(0, 0, 0, 0) && !task.done
  );

  showLottie.value = todayTasks.value.length === 0;

  // Automatically hide Lottie after 1 second
  if (showLottie.value) {
    setTimeout(() => {
      showLottie.value = false;
    }, 5000); // Hide after 1 second
  }
};

const editTask = (task) => {
  emit("edit-task", task); // You can also open a dialog here
};

const deleteTask = (task) => {
  const updatedTasks = props.tasks.filter((t) => t.id !== task.key);
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));

  emit("update-tasks", updatedTasks); // Emit event to parent
  toast.add({
    severity: "info",
    summary: "Deleted",
    detail: "Deleted successfully",
    life: 3000,
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
    <ConfirmPopup></ConfirmPopup>
    <!-- Lottie Animation -->
    <div v-if="showLottie" class="lottie-popup">
      >
      <div class="lottie-popup-content">
        <DotLottieVue
          src="https://lottie.host/5c7e24de-b4b7-472f-b726-d417a92728eb/y3heFHJzoY.lottie"
          autoplay
          loop
          style="width: 200px; height: 200px"
        />
        <p class="text-[15px]">🎉 You’ve just finished your task! 🎉</p>
      </div>
    </div>
    <div class="flex">
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
            @editTask="editTask"
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
            <p class="text-[14px] opacity-85 -translate-y-[20px] font-semibold">
              {{ slotProps.node.label }}
            </p>
          </div>
          <b v-else class="text-white text-lg">{{ slotProps.node.label }}</b>
        </template>
      </Tree>
    </div>
  </div>
</template>

<style>
.p-tree {
  background: transparent !important;
  width: 100%;
}

/* Lottie Popup Styles */
.lottie-popup {
  position: fixed;
  top: -90px;
  left: 16px;
  width: 100vw;
  height: 150vh;
  background-color: rgba(0, 0, 0, 0.848);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.lottie-popup-content {
  background: transparent;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: translateY(-200px);
  border-radius: 8px;
  animation: scaleUp 1s;
}

/* 🎈 Scale Up Effect */
@keyframes scaleUp {
  from {
    transform: scale(0);
    transform: translateY(-200px);
  }
  to {
    transform: scale(1);
    transform: translateY(-200px);
  }
}
.p-tree-node-children .p-tree-node-label {
  width: 100vw;
}
</style>
<style>
.p-toast-message {
  width: 320px;
  float: right;
}
li.p-tree-node {
  width: 100%;
}
.p-tree-node-children {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.p-tree-root-children {
  flex-direction: row !important;
}
li.p-tree-node {
  width: 33.3%;
}
.p-tree-node.p-tree-node-leaf {
  width: 100%;
}
@media screen and (max-width: 850px) {
  .p-tree-root-children {
    flex-direction: column !important;
  }
}
</style>
