import { FC, useState } from 'react';

import loading from '@/lib/loading';
import useStore from "@/lib/store";
import { CardCatProps } from '@/models/CardCatProps';

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Icons } from '@/components/ui/icons';


export const EditCat : FC<CardCatProps> = ( props ) => {

    const { isDeleting, isUpdating, isLoading, isCreating, setIsUpdating, setIsLoading } = useStore();

    const BASE_URL = "http://localhost:9090";

    const { toast } = useToast();

    const [catData, setCatData] = useState({
        name : '',
        color : '',
    });

    const [catDataUpdated, setCatDataUpdated] = useState({
        name : '',
        color : '',
    });

    const handleSheetOpen = async () => {

        setIsLoading(true);
        await loading(1000);

        try {
            const response = await fetch(`${BASE_URL}/cats/${props._id}`);

            setIsUpdating(true);

            if (response.ok) {
                setIsLoading(false);
                const catData = await response.json();
                setCatData(catData);
                console.log(catData)
            } else {
                setIsUpdating(false);
                toast({title: "Failed to update cat", action: (<ToastAction altText="Understand">OK</ToastAction>)});
            };

        } catch (error) {
            console.error('Error fetching cat data', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdate = async () => {

        setIsUpdating(true);
        await loading(2000);

        try {
            const response = await fetch(`${BASE_URL}/cats/${props._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(catDataUpdated),
            });

            if (response.ok) {
                setCatData({ ...catData, ...catDataUpdated });
                props.onCatUpdate();
                toast({ title: "Cat updated successfully", action: (<ToastAction altText="Understand">Undo</ToastAction>) });
            } else {
                toast({ title: "Error during cat update", action: (<ToastAction altText="Understand">OK</ToastAction>) });
                throw new Error('Failed to update cat');
            };

            console.log(catDataUpdated);
        } catch (error) {
            console.log("Error during cat update", error);
            toast({title: "Error while cat update", description: "Try again", action: (<ToastAction altText="Understand">OK</ToastAction>),});
        } finally {
            setIsUpdating(false);
        };

    };


    return (
        <li className="cursor-pointer">
            <Sheet>
                <SheetTrigger asChild>
                    {/* <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" onClick={handleSheetOpen} disabled={isUpdating || isDeleting}>
                                {isUpdating ?
                                <Icons.spinner className="h-4 w-4 animate-spin" />  : '🔎'
                                }
                            </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <span>Modify</span>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider> */}
                    <Button variant="outline" size="icon" onClick={handleSheetOpen} disabled={isUpdating || isDeleting || isLoading || isCreating}>
                        {isUpdating ?
                        <Icons.spinner className="h-4 w-4 animate-spin" />  : '🔎'
                        }
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit cat</SheetTitle>
                        <SheetDescription>
                            Make changes to your cat here.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4 h-10">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            {isLoading ? 
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> 
                                :
                                <Input id="name" className="col-span-3" defaultValue={catData.name} onChange={(e) => setCatDataUpdated({ ...catDataUpdated, name: e.target.value })}/>
                            }
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4 h-10">
                            <Label htmlFor="color" className="text-right">
                                Color
                            </Label>
                            {isLoading ? 
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> 
                                :
                                <Input id="color" className="col-span-3" defaultValue={catData.color} onChange={(e) => setCatDataUpdated({ ...catDataUpdated, color: e.target.value })}/>
                            }
                        </div>
                    </div>
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" onClick={handleUpdate} disabled={isLoading}>
                                {isUpdating && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isUpdating ? 'Updating..' : 'Update'}
                            </Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </li>
    );
};
