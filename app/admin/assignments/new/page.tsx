import NewAssignmentForm from "./NewAssignmentForm";

export default function NewAssignmentPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Assignment</h1>
                <p className="text-muted-foreground">
                    Add a new assignment to the portal.
                </p>
            </div>
            <NewAssignmentForm />
        </div>
    );
}
