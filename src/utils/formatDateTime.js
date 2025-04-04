export const formatDate = (dateStr) => {
    if (!dateStr) return "No Due Date";

    const date = new Date(dateStr);

    const options = {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Ensures AM/PM format
    };

    return date.toLocaleString("en-US", options).replace(",", " -");
};
