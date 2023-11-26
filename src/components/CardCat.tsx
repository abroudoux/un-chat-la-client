import { FC, useState } from 'react';

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Loader2 } from 'lucide-react';


type CardCatProps = {
    _id : string;
    name : string;
    color : string;
    onCatDelete : () => void;
    onCatUpdate : () => void;
};


export const CardCat : FC<CardCatProps> = ( props ) => {

    const BASE_URL = "http://localhost:9090";

    const [catData, setCatData] = useState({
        name : '',
        color : '',
    });

    const [updatedCatData, setUpdatedCatData] = useState({
        name: '',
        color: '',
    });

    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const { toast } = useToast();

    const handleDelete = async () => {
        try {
            setIsDeleting(true);

            const response = await fetch(`${BASE_URL}/cats/${props._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                props.onCatDelete();
                toast({title: "Cat successfully deleted !", action: (<ToastAction altText="Goto schedule to undo">OK</ToastAction>),});
            } else {
                toast({title: "Failed to delete cat", action: (<ToastAction altText="Understand">OK</ToastAction>),});
            };

        } catch (error) {
            console.log("Error during cat deletion", error)
            toast({title: "Error during cat deletion", action: (<ToastAction altText="Goto schedule to undo">Undo</ToastAction>),});
        } finally {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsDeleting(false);
        };
    };

    const handleSheetOpen = async () => {
        try {
            const response = await fetch(`${BASE_URL}/cats/${props._id}`);
            if (response.ok) {
                const catData = await response.json();
                setCatData(catData);
                setUpdatedCatData(catData);
                console.error('Success to fetch cat data');
            } else {
                console.error('Failed to fetch cat data');
            };

        } catch (error) {
            console.error('Error fetching cat data', error);
        };
    };

    const handleUpdate = async () => {
        try {
            setIsUpdating(true);

            const response = await fetch(`${BASE_URL}/cats/${props._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedCatData),
            });

            if (response.ok) {
                props.onCatUpdate();
                toast({title: "Cat updated successfully", action: (<ToastAction altText="Goto schedule to undo">Undo</ToastAction>)});
            } else {
                toast({title: "Error during cat updated", action: (<ToastAction altText="Undersatnd">OK</ToastAction>)});
            };

        } catch (error) {
            console.error('Error during cat deletion', error);
        } finally {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIsUpdating(false);
        };
    };

    return (
        <li className="rounded-lg my-6 border-grey-light border-[1px] flex-row-center-between py-3 px-5 w-96" key={ props._id || 'defaultKey' }>
            <ul className="flex-col-center-between">
                <li className="text-2xl font-normal">{ props.name }</li>
                <li className="font-light text-base">Color : { props.color }</li>
            </ul>
            <ul className="flex-row-center-center gap-3">
                <li className="cursor-pointer">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" onClick={handleSheetOpen}>🔎</Button>
                        </SheetTrigger>
                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle>Edit cat</SheetTitle>
                                <SheetDescription>
                                    Make changes to your cat here. Click save when you're done.
                                </SheetDescription>
                            </SheetHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input id="name" value={updatedCatData.name} className="col-span-3" onChange={(e) => setUpdatedCatData({ ...updatedCatData, name: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="color" className="text-right">
                                        Color
                                    </Label>
                                    <Input id="color" value={updatedCatData.color} className="col-span-3" onChange={(e) => setUpdatedCatData({ ...updatedCatData, color: e.target.value })} />
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button type="submit" onClick={handleUpdate} disabled={isUpdating}>
                                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {isUpdating ? 'Updating..' : 'Update'}
                                    </Button>
                                </SheetClose>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </li>
                <li className="cursor-pointer">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" size="icon">❌</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your (beautiful) cat.
                                    </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setIsDeleting(false)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                                    {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </li>
            </ul>
        </li>
    );
};
