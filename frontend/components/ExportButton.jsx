import XLSX from "xlsx";

export default function ExportButton({ tasks }) {
    function exportData() {
        if (!tasks || tasks.length === 0) {
            alert("No tasks available to export.");
            return;
        }

        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(tasks);

        XLSX.utils.book_append_sheet(wb, ws, "TaskSheet");

        XLSX.utils.sheet_add_aoa(ws, [["ID", "Title", "Done", "Due Date", "Category", "Estimated Hours"]], { origin: "A1" });

        const colWidths = Object.keys(tasks[0]).map((key) => ({
            wch: Math.max(
                key.length,
                ...tasks.map((task) =>
                    task[key] ? task[key].toString().length : 0
                )
            ),
        }));
        ws["!cols"] = colWidths;

        XLSX.writeFile(wb, "Tasks.xlsx");
    }


    return (
        <button
            onClick={exportData}
            className="rounded-xl max-h-12 mt-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700"
        >
            Export to Excel
        </button>
    )
}