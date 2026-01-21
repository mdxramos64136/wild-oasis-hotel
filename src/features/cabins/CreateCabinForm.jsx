import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import FormRow from "../../ui/FormRow";
import Textarea from "../../ui/Textarea";

import { useForm } from "react-hook-form";
import { createEditCabin } from "../../services/apiCabins";

/************************************************************* */
function CreateCabinForm({ cabinToEdit = {} }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  // to reset/invalidate the query, use the query client...
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });
  const { errors } = formState;

  // ADD //
  const { mutate: mutateCreate, isLoading: isCreating } = useMutation({
    //alt.: mutateFn: CreateEditCabin
    mutationFn: (newCabin) => createEditCabin(newCabin),
    onSuccess: () => {
      toast.success("New cabin successfully created ");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  // Edit //
  const { mutate: mutateEdit, isLoading: isEditing } = useMutation({
    //alt.: mutateFn: CreateEditCabin
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin successfully edited ");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      reset();
    },
    onError: (err) => toast.error(err.message),
  });

  const isWorking = isCreating || isEditing;

  /********* Button Functions *********/

  function onSubmit(data) {
    //console.log(data); //image is the exactly name of the columns in supabase
    const image = typeof data.image === "string" ? data.image : data.image[0];

    if (isEditSession)
      mutateEdit({ newCabinData: { ...data, image }, id: editId });
    else mutateCreate({ ...data, image: image });
  }

  function onError(errors) {
    console.log(Object(errors));
  }

  //
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow label="Cabin Name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          {...register("name", {
            required: "This field is required!",
          })}
        />
      </FormRow>

      <FormRow label="Maximum Capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disable={isWorking}
          {...register("maxCapacity", {
            required: "This field is required!",
            min: { value: 1, message: "Capacity should be at least 1" },
          })}
        />
      </FormRow>

      <FormRow label="Regular Price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disable={isWorking}
          {...register("regularPrice", {
            required: "This field is required!",
            min: { value: 1, message: "Capacity should be at least 1" },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disable={isWorking}
          defaultValue={0}
          {...register("discount", {
            required: "This field is required!",
            validate: (value) =>
              value <= getValues().regularPrice ||
              "Discount should be less than the regular price",
          })}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <Textarea
          type="number"
          id="description"
          disable={isWorking}
          defaultValue=""
          {...register("description", {
            required: "This field is required!",
          })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "This field is required!",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disable={isWorking}>
          {isEditSession ? "Edit Cabin" : "Add New Cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
