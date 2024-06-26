"use server";
import { auth } from "@clerk/nextjs/server";
import { createServerClient } from "@supabase/ssr";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const createSites = async (
  site_name: string,
  site_description: string,
  site_subdomain: string,
  site_logo: string
) => {

  if (site_subdomain.toLocaleLowerCase() === "www") {
    return {
      message: "Not allowed to use www as a subdomain",
    };
  }

  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  try {
    const { data, error } = await supabase
      .from("sites")
      .insert([
        {
          user_id: userId,
          site_name,
          site_description,
          site_subdomain: site_subdomain.toLowerCase(),
          site_logo,
        },
      ])
      .select();
    if (error?.code) {
      return {
        error,
      };
    }
    revalidatePath("/cms/sites");

    return data;
  } catch (error: any) {
    return error;
  }
};
