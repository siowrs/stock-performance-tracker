"use server";

import { z } from "zod";
import prisma from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import GithubSlugger from "github-slugger";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";

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

export async function fetchSectorBySlug(sectorSlug: string) {
  try {
    return await prisma.sector.findUnique({
      where: {
        slug: sectorSlug,
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
  sectorId: string,
  prevState: any,
  formData: Prisma.SectorUpdateInput
) {
  try {
    await prisma.sector.update({
      where: {
        id: sectorId,
      },
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

export async function deleteSector(sectorId: string) {
  try {
    await prisma.sector.delete({
      where: {
        id: sectorId,
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
export async function fetchCounterBySlug(counterSlug: string) {
  try {
    return await prisma.counter.findUnique({
      where: {
        slug: counterSlug,
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
        remarks: formData.remarks || "",
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
  counterId: string,
  prevState: any,
  formData: Prisma.CounterUpdateInput
) {
  try {
    await prisma.counter.update({
      where: {
        id: counterId,
      },
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

export async function deleteCounter(counterId: string) {
  try {
    await prisma.counter.delete({
      where: {
        id: counterId,
      },
    });
  } catch (error) {
    console.error(`Database error: ${error}`);
    throw new Error("Failed to delete counter.");
  }
  revalidatePath("/counters");
}

//---position---//
export async function fetchPositions() {
  try {
    return await prisma.position.findMany({
      // query for both position and counter name
      include: {
        counter: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });
  } catch (error) {
    consoleError(error);
    throw new Error("Failed to fetch all positions.");
  }
}

export async function fetchOpenPositions() {
  try {
    return await prisma.position.findMany({
      where: {
        status: "open",
      },
    });
  } catch (error) {
    consoleError(error);
    throw new Error("Failed to fetch open positions.");
  }
}

export async function fetchPositionById(positionId: string) {
  try {
    return await prisma.position.findUnique({
      where: {
        id: positionId,
      },
    });
  } catch (error) {
    consoleError(error);
    throw new Error("Failed to fetch position by ID.");
  }
}

export type PositionErrorState =
  | {
      // errors?: {
      //   name?: string;
      //   country?: string;
      // };
      message?: string | null;
    }
  | undefined;

export async function createPosition(
  prevState: PositionErrorState,
  formData: Prisma.PositionCreateInput & Prisma.PositionTransactionCreateInput
): Promise<PositionErrorState> {
  // check if open position for this counter already exist
  const positions = await prisma.position.findMany();
  if (positions.some((p) => p.counterId === formData.counter)) {
    //  throw new Error(
    //    "Can only open one position for each counter. Please close the previous position before opening a new one."
    //  );
    return {
      message:
        "Can only open one position for each counter. Please close the previous position before opening a new one.",
    };
  }

  try {
    await prisma.position.create({
      data: {
        quantity: +formData.quantity,
        status: "open",
        openedAt: new Date(formData.openedAt).toISOString(),
        avgBuyPrice: new Prisma.Decimal(+formData.unitPrice),
        avgSellPrice: Prisma.skip,
        counter: {
          connect: { id: formData.counter as string },
        },
        //create record simultaneously
        transaction: {
          create: {
            action: "buy",
            unitPrice: new Prisma.Decimal(+formData.unitPrice),
            quantity: +formData.quantity,
            totalPrice: new Prisma.Decimal(
              +formData.unitPrice * +formData.quantity
            ),
            createdAt: new Date(formData.openedAt).toISOString(),
          },
        },
      },
    });
  } catch (error) {
    consoleError(error);
    // throw new Error("Failed to create new position.");
    return {
      message: "Failed to create new position.",
    };
  }

  revalidatePath("/positions");
}

async function calculateAvgPrice(
  positionId: string,
  action: "buy" | "sell",
  formUnitPrice: string | number | Prisma.Decimal | Prisma.DecimalJsLike,
  formQuantity: string | number
) {
  const {
    _sum: { totalPrice, quantity },
  } = await prisma.positionTransaction.aggregate({
    _sum: {
      totalPrice: true,
      quantity: true,
    },
    where: {
      positionId,
      action: action,
    },
  });

  // totalPrice returns a Decimal.js object
  // following the data type in Prisma schema
  // therefore must use decimal.js method to calculate
  const prevTotalPrice = totalPrice ?? new Prisma.Decimal(0);

  const prevQuantitySum = quantity ?? 0;

  const formDataTotalPrice = new Prisma.Decimal(+formUnitPrice).times(
    formQuantity
  );

  const newTotalPrice = prevTotalPrice.plus(formDataTotalPrice);

  const avgPrice = newTotalPrice
    .dividedBy(prevQuantitySum + +formQuantity)
    .toDecimalPlaces(3);

  return [avgPrice, formDataTotalPrice];
}
// average up
export async function increasePosition(
  positionId: string,
  prevState: unknown,
  formData: Prisma.PositionUpdateInput & Prisma.PositionTransactionCreateInput
) {
  try {
    const [avgBuyPrice, formDataTotalPrice] = await calculateAvgPrice(
      positionId,
      "buy",
      formData.unitPrice,
      formData.quantity
    );

    await prisma.position.update({
      where: {
        id: positionId,
        status: "open",
      },
      data: {
        quantity: {
          increment: +formData.quantity,
        },
        avgBuyPrice: avgBuyPrice,
        transaction: {
          create: {
            action: "buy",
            unitPrice: +formData.unitPrice,
            quantity: +formData.quantity,
            totalPrice: formDataTotalPrice,
          },
        },
      },
    });
  } catch (error) {
    consoleError(error);
    throw new Error("Failed to increase position.");
  }

  redirect("/positions");
}

// average down
// tdl limit input to available quanitty, similar to moomoo
export async function decreasePosition(
  positionId: string,
  prevState: unknown,
  formData: Prisma.PositionUpdateInput & Prisma.PositionTransactionCreateInput
) {
  try {
    const currentPosition = await prisma.position.findUnique({
      where: {
        id: positionId,
        status: "open",
      },
      select: {
        quantity: true,
      },
    });

    // if position doesnt exist or closed
    if (!currentPosition) {
      throw new Error("Position doesn't exist or already closed.");
    }

    // if trying sell more than actual quantity
    if (+formData.quantity > currentPosition.quantity) {
      throw new Error(
        `Unable to sell ${formData.quantity} units. Only ${currentPosition.quantity} units available.`
      );
    }

    const [avgSellPrice, formDataTotalPrice] = await calculateAvgPrice(
      positionId,
      "sell",
      formData.unitPrice,
      formData.quantity
    );

    const remainingQuantity = +formData.quantity - currentPosition.quantity;

    await prisma.position.update({
      where: {
        id: positionId,
        status: "open",
      },
      data: {
        quantity: {
          decrement: +formData.quantity,
        },
        status: remainingQuantity === 0 ? "closed" : "open",
        avgSellPrice: avgSellPrice,
        transaction: {
          create: {
            action: "sell",
            unitPrice: +formData.unitPrice,
            quantity: +formData.quantity,
            totalPrice: formDataTotalPrice,
          },
        },
      },
    });
  } catch (error) {
    consoleError(error);
    throw new Error("Failed to decrease position.");
  }
  redirect("/positions");
}

export async function closePosition(
  positionId: string,
  prevState: unknown,
  formData: Prisma.PositionUpdateInput
) {
  try {
    await prisma.position.update({
      where: {
        id: positionId,
      },
      data: {
        //tdl calculate remaining position
      },
    });
  } catch (error) {}
}

//---position transaction---//
export async function fetchPositionTransactionByPositionId(positionId: string) {
  try {
    return await prisma.positionTransaction.findUnique({
      where: {
        id: positionId,
      },
    });
  } catch (error) {
    consoleError(error);
    throw new Error("Failed to fetch position transaction by positon ID.");
  }
}
