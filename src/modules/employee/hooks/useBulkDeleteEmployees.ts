
import { Employee } from "../types/employee"
import { useDeleteEmployee } from "./useDeleteEmployee"

export const useBulkDeleteEmployees = () => {
	const deleteEmployeeMutation = useDeleteEmployee()

	const bulkDelete = async (selectedRows: Employee[]) => {
		for (const employee of selectedRows) {
			await deleteEmployeeMutation.mutateAsync(employee.id)
		}
	}

	return bulkDelete
}
