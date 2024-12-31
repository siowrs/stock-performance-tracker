"use server";

import { z } from "zod";
import prisma from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import GithubSlugger from "github-slugger";
import { Prisma } from "@prisma/client";

const consoleError = (err: unknown) => console.error(`Database error: ${err}`);
const slugger = new GithubSlugger();
// tdl: add zod validation

//---sector---//
const FormSchema = z.object({
  id: z.string(),
  name: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  country: z.coerce.number().gt(0, {
    message: "Please enter an amount greater than $0.",
  }),
});

export type SectorErrorState = {
  errors?: {
    name?: string[];
    country?: string[];
  };
  message?: string | null;
};

// export type Sector = {
//   name: string;
//   country: string;
// };

export async function fetchSectors() {
  try {
    return await prisma.sector.findMany();
  } catch (error) {
    consoleError(error);
    throw new Error("Failed to fetch all sectors.");
  }
}

export async function fetchSectorBySlug(slug: string) {
  try {
    return await prisma.sector.findUnique({
      where: {
        slug: slug,
      },
    });
  } catch (error) {
    consoleError(error);
    throw new Error("Failed to fetch sector by slug.");
  }
}

export async function fetchSectorsByCountry(country: string) {
  try {
    return await prisma.sector.findMany({
      where: { country: country },
    });
  } catch (error) {
    consoleError(error);
    throw new Error(`Failed to fetch sectors from ${country}.`);
  }
}

export async function createSector(
  prevState: any,
  formData: Prisma.SectorCreateInput
) {
  try {
    await prisma.sector.create({
      data: {
        name: formData.name as string,
        slug: slugger.slug((formData.name + "-" + formData.country) as string),
        country: formData.country as string,
      },
    });
  } catch (error) {
    return {
      message: "Database error: Failed to create sector.",
    };
  }

  revalidatePath("/sectors");
}
export async function updateSector(
  id: string,
  prevState: any,
  formData: Prisma.SectorUpdateInput
) {
  try {
    await prisma.sector.update({
      where: { id },
      data: {
        name: formData.name as string,
        slug: slugger.slug((formData.name + "-" + formData.country) as string),
        country: formData.country as string,
      },
    });
  } catch (error) {
    return {
      message: "Database error: Failed to update sector.",
    };
  }

  redirect("/sectors");
}

export async function deleteSector(id: string) {
  try {
    await prisma.sector.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    return {
      message: "Database error: Failed to create delete.",
    };
  }

  revalidatePath("/sectors");
}

//---counter---//
// export type Counter = {
//   symbol: string;
//   name: string;
//   sector: string;
//   country: string;
//   remarks?: string;
// };

export async function fetchCounters() {
  try {
    return await prisma.counter.findMany();
  } catch (error) {
    consoleError(error);
    throw new Error("Failed to fetch all counters.");
  }
}
export async function fetchCounterBySlug(slug: string) {
  try {
    return await prisma.counter.findUnique({
      where: {
        slug: slug,
      },
    });
  } catch (error) {
    consoleError(error);
    throw new Error("Failed to fetch counter by slug.");
  }
}
export async function createCounter(
  prevState: any,
  formData: Prisma.CounterCreateInput
) {
  try {
    await prisma.counter.create({
      data: {
        symbol: formData.symbol.toUpperCase() as string,
        name: formData.name as string,
        slug: slugger.slug((formData.name + "-" + formData.country) as string),
        country: formData.country as string,
        remarks: formData.remarks as string,
        sector: {
          connect: { id: formData.sector as string },
        },
      },
    });
  } catch (error) {
    console.error(`Database error: ${error}`);
    throw new Error("Failed to create counter.");
  }

  revalidatePath("/counters");
}

export async function updateCounter(
  id: string,
  prevState: any,
  formData: Prisma.CounterUpdateInput
) {
  try {
    await prisma.counter.update({
      where: { id },
      data: {
        symbol: (formData.symbol as string).toUpperCase(),
        name: formData.name as string,
        slug: slugger.slug((formData.name + "-" + formData.country) as string),
        country: formData.country as string,
        sector: {
          connect: { id: formData.sector as string },
        },
        remarks: formData.remarks as string,
      },
    });
  } catch (error) {
    consoleError(error);
    throw new Error("Failed to update counter.");
  }

  redirect("/counters");
}

export async function deleteCounter(id: string) {
  try {
    await prisma.counter.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error(`Database error: ${error}`);
    throw new Error("Failed to delete counter.");
  }
  revalidatePath("/counters");
}

//---position---//
