import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";

export function useEditHook() {
  const queryClient = useQueryClient();

  const { mutate: mutateEdit, isLoading: isEditing } = useMutation({
    //alt.: mutateFn: CreateEditCabin
    mutationFn: ({ newCabinData, id }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success("Cabin successfully edited ");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { mutateEdit, isEditing };
}
