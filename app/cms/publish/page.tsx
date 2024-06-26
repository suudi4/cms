"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { storeArticles } from "@/utils/actions/articles/store-articles";
import { useGetAllAuthors } from "@/utils/hooks/useGetAllAuthors";
import { useGetAllCategories } from "@/utils/hooks/useGetAllCategories";
import { useGetAllDocuments } from "@/utils/hooks/useGetAllDocuments";
import { useGetAllSites } from "@/utils/hooks/useGetAllSites";
import { UploadDropzone } from "@/utils/uploadthing";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  slug: z.string(),
  keywords: z.string(),
  image_alt: z.string(),
  author: z.string(),
  category: z.string(),
  article: z.string(),
  site_id: z.string(),
});

export default function Publish() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      slug: "",
      keywords: "",
      image_alt: "",
      author: "",
      category: "",
      article: "",
      site_id: "",
    },
  });

  const [imageUploadUrl, setImageUploadUrl] = useState<string>("");

  const { data: documentData } = useGetAllDocuments();
  const { data: authorsData } = useGetAllAuthors();
  const { data: categoryData } = useGetAllCategories();
  const { data: sitesData } = useGetAllSites();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const response = await storeArticles(
        data?.title,
        data?.subtitle,
        data?.slug,
        data?.article,
        data?.author,
        data?.category,
        data?.keywords,
        imageUploadUrl,
        data?.image_alt,
        data?.site_id
      );
      console.log("response", response);
      toast("Article is published");
      form.reset();
      return response;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  }

  console.log("sitesData", sitesData);

  return (
    <main className="flex min-w-screen p-4 flex-col items-center justify-between ">
      <div className="flex flex-col mb-[5rem] w-full">
        <h1 className=" text-3xl font-semibold tracking-tight">Publish</h1>
        <p className="leading-7 text-sm dark:text-gray-400">
          Get ready to publish articles that have been written and saved
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[600px] mt-[0.5rem] space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter title here</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>This is your article title.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter subtitle here</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>This is your article subtitle.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center items-center w-full gap-3">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Enter slug here</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>This is your article slug.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Enter keywords here</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Pizza, Chicken, Food" />
                    </FormControl>
                    <FormDescription>Separate keywords by comma.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" size="sm">
                  Upload Cover
                </Button>
              </DialogTrigger>
              <DialogContent>
                <UploadDropzone
                  className="p-8"
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    setImageUploadUrl(res?.[0]?.url);
                    toast(`Image uploaded`);
                  }}
                  onUploadError={(error: Error) => {
                    toast(`ERROR! ${error.message}`);
                  }}
                />
                <DialogClose asChild>
                  <div className="flex justify-end">
                    <Button type="button" variant="outline">Close</Button>
                  </div>
                </DialogClose>
              </DialogContent>
            </Dialog>

            {imageUploadUrl !== "" && (
              <div className="flex flex-col justify-center items-start w-full gap-3 mt-2">
                <Label>Image Url</Label>
                <Input value={imageUploadUrl} readOnly />
                <FormField
                  control={form.control}
                  name="image_alt"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Enter Image alt text</FormLabel>
                      <FormControl>
                        <Input placeholder="Image alt text" {...field} />
                      </FormControl>
                      <FormDescription>This is your image alt text.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <div className="flex justify-center items-center w-full gap-3">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Author</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an author" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {authorsData?.map((info: any) => (
                          <SelectItem key={info?.id} value={info?.author_id}>
                            {info?.author_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryData?.map((info: any) => (
                          <SelectItem key={info?.id} value={String(info?.id)}>
                            {info?.category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="article"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a document" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentData?.map((info: any) => (
                        <SelectItem key={info?.id} value={info?.document}>
                          {info?.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="site_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publish to Site</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the site" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sitesData?.map((site: any) => (
                        <SelectItem key={site?.site_id} value={site?.site_id}>
                          {site?.site_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex">
              <Button type="submit" size="sm">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
