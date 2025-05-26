import { VenueForm } from '../../components/venue';

export default function EditVenueForm({ venue, onSave, onCancel, loading }) {
  return (
    <VenueForm
      mode="edit"
      initialData={venue}
      onSubmit={onSave}
      onCancel={onCancel}
      loading={loading}
      submitText="Save Changes"
      cancelText="Cancel"
    />
  );
} 