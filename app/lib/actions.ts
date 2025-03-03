"use server";

import { z } from "zod";
import prisma from "@/app/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import GithubSlugger, { slug } from "github-slugger";
import { Counter, Position, PositionTransaction, Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { convertDataCurrency, parseAndStringify } from "./misc";
import { message } from "antd";

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

export type ReturnStatus = {
  status: "success" | "error" | undefined;
  message: string;
};

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
        slug: slug((formData.name + "-" + formData.country) as string),
        country: formData.country as string,
      },
    });
  } catch (error) {
    return {
      status: "error",
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
        slug: slug((formData.name + "-" + formData.country) as string),
        country: formData.country as string,
      },
    });
  } catch (error) {
    return {
      status: "error",
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
      status: "error",
      message: "Database error: Failed to create delete.",
    };
  }

  revalidatePath("/sectors");
}

//---counter---//
export type CounterDataType = Omit<
  Counter,
  | "totalBuyingCost"
  | "totalRealizedRevenue"
  | "totalRealizedGL"
  | "absoluteRealizedGLPercentage"
> & {
  totalBuyingCost: string;
  totalRealizedRevenue: string;
  totalRealizedGL: string;
  absoluteRealizedGLPercentage: string;
};

export type CounterReturnState = {
  // tdl validation
  fieldError?: {
    symbol?: string;
  };
} & ReturnStatus;

export async function fetchTopGainer(): Promise<
  CounterDataType | null | CounterReturnState
> {
  try {
    const counter = await prisma.counter.findFirst({
      where: {
        totalRealizedGL: {
          gt: 0,
        },
      },
      orderBy: {
        totalRealizedGL: "desc",
      },
    });
    return parseAndStringify(counter);
  } catch (error) {
    consoleError(error);
    return {
      status: "error",
      message: "Failed to fetch top gainer.",
    };
  }
}

export async function fetchTopLoser(): Promise<
  CounterDataType | null | CounterReturnState
> {
  try {
    const counter = await prisma.counter.findFirst({
      where: {
        totalRealizedGL: {
          lt: 0,
        },
      },
      orderBy: {
        totalRealizedGL: "asc",
      },
    });
    return parseAndStringify(counter);
  } catch (error) {
    consoleError(error);
    return {
      status: "error",
      message: "Failed to fetch top gainer.",
    };
  }
}

export async function fetchCounters(): Promise<
  CounterDataType[] | CounterReturnState
> {
  try {
    const counters = await prisma.counter.findMany({
      include: {
        // positions: {
        //   select: {
        //     realizedGL: true,
        //     totalCost: true,
        //   },
        // },
        sector: {
          select: {
            name: true,
          },
        },
      },
    });

    // const formattedCounters = counters.map((c, i) => {
    // const { totalCost, realizedGL } = c.positions.reduce(
    //   (acc, p) => {
    //     acc.totalCost = acc.totalCost.plus(p.totalCost);
    //     acc.realizedGL = acc.realizedGL.plus(p.realizedGL);
    //     return acc;
    //   },
    //   {
    //     totalCost: new Prisma.Decimal(0),
    //     realizedGL: new Prisma.Decimal(0),
    //   }
    // );

    // leave out the position prop
    // const { positions, ...rest } = {
    // ...c,
    // totalCost,
    // realizedGL,
    //   absoluteRealizedGLPercentage: totalCost.isZero()
    //     ? 0
    //     : realizedGL.dividedBy(totalCost).times(100).toDecimalPlaces(2),
    // };

    // console.log(rest);
    // return rest;
    // });
    return parseAndStringify(counters);
  } catch (error) {
    consoleError(error);
    return {
      status: "error",
      message: "Failed to fetch all counters.",
    };
  }
}

export type CounterWithPositionDataType = CounterDataType & {
  // positions: Omit<PositionDataType, "counter">[];
  positions: PositionDataType[];
  sector: {
    name: string;
  };
};
export async function fetchCounterBySlug(
  counterSlug: string
): Promise<CounterWithPositionDataType | null | CounterReturnState> {
  try {
    const counter = await prisma.counter.findUnique({
      where: {
        slug: counterSlug,
      },
      include: {
        positions: {
          include: {
            counter: {
              select: {
                name: true,
              },
            },
          },
        },
        sector: {
          select: {
            name: true,
          },
        },
      },
    });
    return parseAndStringify(counter);
  } catch (error) {
    consoleError(error);
    return {
      status: "error",
      message: "Failed to fetch counter by slug.",
    };
  }
}

//tdl: add currency support as much as possible
let currency: { [key: string]: string } = {
  us: "USD",
  my: "RM",
};

export async function createCounter(
  prevState: CounterReturnState,
  formData: Prisma.CounterCreateInput
): Promise<CounterReturnState> {
  try {
    await prisma.counter.create({
      // tdl:validation
      data: {
        symbol: formData.symbol.toUpperCase() as string,
        name: formData.name as string,
        // slug: slugger.slug(
        //   (formData.symbol + "-" + formData.country) as string
        // ),
        slug: slug(formData.symbol + "-" + formData.country) as string,

        country: formData.country as string,
        currency: currency[formData.country],
        remarks: formData.remarks || "",
        sector: {
          connect: { id: formData.sector as string },
        },
      },
    });
  } catch (error) {
    consoleError(`Database error: ${error}`);
    return {
      status: "error",
      message: "Failed to create counter.",
    };
  }
  revalidatePath("/counters");

  return {
    status: "success",
    message: "Counter created successfully.",
  };
}

export async function updateCounter(
  counterId: string,
  prevState: CounterReturnState,
  formData: Prisma.CounterUpdateInput
): Promise<CounterReturnState> {
  try {
    await prisma.counter.update({
      where: {
        id: counterId,
      },
      data: {
        symbol: (formData.symbol as string).toUpperCase(),
        name: formData.name as string,
        slug: slug((formData.symbol + "-" + formData.country) as string),
        country: formData.country as string,
        currency: currency[formData.country as string],
        sector: {
          connect: { id: formData.sector as string },
        },
        remarks: formData.remarks as string,
      },
    });
  } catch (error) {
    consoleError(error);

    return {
      status: "error",
      message: "Failed to update counter.",
    };
  }

  revalidatePath("/counters");

  return {
    status: "success",
    message: "Counter updated successfully.",
  };
}

// export async function deleteCounter(counterId: string) {
//   try {
//     await prisma.counter.delete({
//       where: {
//         id: counterId,
//       },
//     });
//   } catch (error) {
//     console.error(`Database error: ${error}`);
//     throw new Error("Failed to delete counter.");
//   }
//   revalidatePath("/counters");
// }

//---position---//

export type PositionReturnState = {
  //tdl this for validation
  fieldError?: {
    name?: string;
    country?: string;
  };
} & ReturnStatus;

export type PositionDataType = Omit<
  Position,
  | "avgBuyPrice"
  | "avgSellPrice"
  | "realizedGL"
  | "totalCost"
  | "absoluteRealizedGLPercentage"
> & {
  avgBuyPrice: string;
  avgSellPrice: string | null;
  realizedGL: string;
  absoluteRealizedGLPercentage: string;
  totalCost: string;
  counter: Pick<Counter, "country" | "name" | "slug" | "symbol" | "currency">;
};

export type PositionTransactionDataType = Omit<
  PositionTransaction,
  "unitPrice" | "totalPrice"
> & {
  unitPrice: string;
  totalPrice: string;
};

export type PositionWithTransactionDataType = PositionDataType & {
  transactions: PositionTransactionDataType[];
};

export async function fetchPositions(
  status?: "open" | "closed"
): Promise<PositionDataType[] | PositionReturnState> {
  try {
    const positions = await prisma.position.findMany({
      ...(status && {
        where: {
          status: status,
        },
      }),
      // query for both position and counter name
      include: {
        counter: {
          select: {
            name: true,
            slug: true,
            symbol: true,
            currency: true,
            country: true,
          },
        },
      },
    });
    //parse it again since decimal cant pass to client component
    return parseAndStringify(positions);
  } catch (error) {
    consoleError(error);
    return {
      status: "error",
      message: "Failed to fetch all positions.",
    };
  }
}

// export async function fetchOpenPositions() {
//   try {
//     return await prisma.position.findMany({
//       where: {
//         status: "open",
//       },
//     });
//   } catch (error) {
//     consoleError(error);
//     throw new Error("Failed to fetch open positions.");
//   }
// }

export async function fetchPositionById(
  positionId: string
): Promise<PositionWithTransactionDataType | null | PositionReturnState> {
  try {
    const position = await prisma.position.findUnique({
      where: {
        id: positionId,
      },
      include: {
        counter: {
          select: {
            name: true,
            slug: true,
            symbol: true,
            currency: true,
          },
        },
        transactions: true,
      },
    });

    return parseAndStringify(position);
  } catch (error: any) {
    consoleError(error);

    return {
      status: "error",
      message: "Failed to fetch position by ID.",
    };
  }
}

export async function createPosition(
  prevState: PositionReturnState,
  formData: Prisma.PositionCreateInput & Prisma.PositionTransactionCreateInput
): Promise<PositionReturnState> {
  // check if open position for this counter already exist
  const positions = await prisma.position.findMany();
  if (
    positions.some(
      (p) => p.counterId === formData.counter && p.status === "open"
    )
  ) {
    return {
      status: "error",
      message:
        "Can only open one position for each counter. Please close the previous position before opening a new one.",
    };
  }

  //fetch counter for currency
  const counter = await prisma.counter.findUnique({
    where: {
      id: formData.counter as string,
    },
    select: {
      id: true,
      country: true,
    },
  });

  if (!counter) {
    return {
      status: "error",
      message: "Selected counter does not exist.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.position.create({
        data: {
          quantityBought: +formData.quantity,
          quantityRemaining: +formData.quantity,
          status: "open",
          openedAt: new Date(formData.transactionDate).toISOString(),
          avgBuyPrice: new Prisma.Decimal(+formData.unitPrice),
          avgSellPrice: Prisma.skip,
          totalCost: +formData.quantity * +formData.unitPrice,
          realizedGL: 0,
          updatedAt: new Date(formData.transactionDate).toISOString(),
          // absoluteRealizedGLPercentage: 0,
          counter: {
            connect: { id: counter.id },
          },
          //create record simultaneously
          transactions: {
            create: {
              action: "buy",
              unitPrice: new Prisma.Decimal(+formData.unitPrice),
              quantity: +formData.quantity,
              totalPrice: new Prisma.Decimal(
                +formData.unitPrice * +formData.quantity
              ),
              transactionDate: new Date(formData.transactionDate).toISOString(),
            },
          },
        },
      });

      await tx.counter.update({
        where: {
          id: counter.id,
        },
        data: {
          totalBuyingCost: {
            increment: +formData.quantity * +formData.unitPrice,
          },
        },
      });
    });
  } catch (error) {
    consoleError(error);
    return {
      status: "error",
      message: "Failed to create new position.",
    };
  }

  revalidatePath("/positions");

  return {
    status: "success",
    message: "Position created successfully.",
  };
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

  const newQuantitySum = prevQuantitySum + +formQuantity;

  const formDataTotalPrice = new Prisma.Decimal(+formUnitPrice).times(
    formQuantity
  );

  const newTotalPrice = prevTotalPrice.plus(formDataTotalPrice);

  const avgPrice = newTotalPrice.dividedBy(newQuantitySum).toDecimalPlaces(3);

  return [avgPrice, formDataTotalPrice, newTotalPrice];
}

export async function updatePosition(
  positionId: string,
  prevState: PositionReturnState,
  formData: Prisma.PositionUpdateInput & Prisma.PositionTransactionCreateInput
): Promise<PositionReturnState> {
  const currentPosition = await prisma.position.findUnique({
    where: {
      id: positionId,
      status: "open",
    },
    select: {
      quantityBought: true,
      quantityRemaining: true,
      totalCost: true,
      avgBuyPrice: true,
      realizedGL: true,
      counter: true,
    },
  });

  const action = formData.action;

  // if position doesnt exist or closed
  if (!currentPosition) {
    return {
      status: "error",
      message: "Position doesn't exist or already closed.",
    };
  }

  const { counter } = currentPosition;

  // if trying sell more than remaining quantity
  const remainingQuantity =
    currentPosition.quantityRemaining - +formData.quantity;
  if (action == "sell" && remainingQuantity < 0) {
    return {
      status: "error",
      message: `Unable to sell ${formData.quantity} units. Only ${currentPosition.quantityRemaining} units available.`,
    };
  }

  const realizedGL = new Prisma.Decimal(+formData.unitPrice)
    .times(formData.quantity)
    .minus(currentPosition.avgBuyPrice.times(formData.quantity));

  try {
    const [avgPrice, formDataTotalPrice, newTotalPrice] =
      await calculateAvgPrice(
        positionId,
        action,
        formData.unitPrice,
        formData.quantity
      );

    await prisma.position.update({
      where: {
        id: positionId,
        status: "open",
      },
      data: {
        //if action is buy
        ...(action === "buy" && {
          quantityBought: {
            increment: +formData.quantity,
          },
          quantityRemaining: {
            increment: +formData.quantity,
          },
          avgBuyPrice: avgPrice,
          totalCost: newTotalPrice,
          counter: {
            update: {
              totalBuyingCost: {
                increment: newTotalPrice,
              },
              absoluteRealizedGLPercentage: counter.totalRealizedGL.dividedBy(
                counter.totalBuyingCost
                  .plus(newTotalPrice)
                  .times(100)
                  .toDecimalPlaces(2)
              ),
            },
          },
        }),

        //if action is sell
        ...(action === "sell" && {
          quantityRemaining: {
            decrement: +formData.quantity,
          },

          // gain/loss for the specific transaction
          // formula: provided by our Claude AI overlord
          // tdl check for positive gain if this formula works
          // (Sell Price * Quantity Sold) - (Average Buy Price * Quantity Sold)
          realizedGL: {
            increment: realizedGL,
          },
          // Calculate cost basis for the portion being sold
          // again formula provided by our AI overlord
          // absoluteRealizedGLPercentage = realizedGL / (avgBuyPrice × quantity sold)​ × 100
          // total absoluteRealizedGLPercentage = realizedGL + past realizedGL / total cost​ × 100
          absoluteRealizedGLPercentage: realizedGL
            .plus(currentPosition.realizedGL)
            .dividedBy(currentPosition.totalCost)
            .times(100)
            .toDecimalPlaces(2),

          avgSellPrice: avgPrice,
          status: remainingQuantity === 0 ? "closed" : "open",
          counter: {
            update: {
              totalRealizedRevenue: {
                increment: formDataTotalPrice,
              },
              totalRealizedGL: {
                increment: realizedGL,
              },
              absoluteRealizedGLPercentage: counter.totalRealizedGL
                .plus(realizedGL)
                .dividedBy(counter.totalBuyingCost)
                .times(100)
                .toDecimalPlaces(2),
            },
          },
        }),
        updatedAt: new Date(formData.transactionDate).toISOString(),
        transactions: {
          create: {
            action: action,
            unitPrice: +formData.unitPrice,
            quantity: +formData.quantity,
            totalPrice: formDataTotalPrice,
            transactionDate: new Date(formData.transactionDate).toISOString(),
          },
        },
      },
    });
  } catch (error) {
    consoleError(error);
    return {
      status: "error",
      message: "Failed to increase position.",
    };
  }

  revalidatePath("/positions");

  return {
    status: "success",
    message: "Position updated successfully.",
  };
}

export async function deletePosition(
  positionId: string
): Promise<PositionReturnState> {
  try {
    await prisma.$transaction(async (tx) => {
      const position = await tx.position.findUnique({
        where: {
          id: positionId,
        },
        include: {
          transactions: true,
          counter: true,
        },
      });

      if (!position) {
        return {
          status: "error",
          message: "Position not found.",
        };
      }

      const counterTotalCost = position.counter.totalBuyingCost
        .minus(position.totalCost)
        .toDecimalPlaces(3);

      const counterTotalRealizedRevenue = position.counter.totalRealizedRevenue
        .minus(
          position.transactions.reduce((acc, t) => {
            if (t.action === "sell") {
              acc = acc.plus(t.totalPrice);
            }
            return acc;
          }, new Prisma.Decimal(0))
        )
        .toDecimalPlaces(3);

      const counterRealizedGL = position.counter.totalRealizedGL
        .minus(position.realizedGL)
        .toDecimalPlaces(3);

      // since theres no such thing as divide by 0,
      // then if countertotalcost is 0,
      // set counterAbsoluteRealizedGLPercentage to 0
      const counterAbsoluteRealizedGLPercentage = counterTotalCost.isZero()
        ? new Prisma.Decimal(0)
        : counterRealizedGL
            .dividedBy(counterTotalCost)
            .times(100)
            .toDecimalPlaces(2);

      await tx.position.update({
        where: {
          id: positionId,
        },
        data: {
          counter: {
            update: {
              totalBuyingCost: counterTotalCost,
              totalRealizedRevenue: counterTotalRealizedRevenue,
              totalRealizedGL: counterRealizedGL,
              absoluteRealizedGLPercentage: counterAbsoluteRealizedGLPercentage,
            },
          },
        },
      });

      await tx.position.delete({
        where: { id: positionId },
      });
    });
  } catch (error: any) {
    consoleError(error);

    revalidatePath("/positions");

    // if position does not exist
    if (error.code === "P2025") {
      return {
        status: "error",
        message: "Position does not exist.",
      };
    }

    return {
      status: "error",
      message: "Failed to delete position.",
    };
  }
  revalidatePath("/positions");

  return {
    status: "success",
    message: "Position deleted successfully.",
  };
}

//---position transaction---//
// tdl: updatetransaction
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

export type YearlyPerformanceDataType = {
  month: string;
  currency: string;
  type: string;
  value: number;
};

//---fetch dashboard data---//
export async function fetchYearlyPerformance(
  year: number,
  currency: string
): Promise<YearlyPerformanceDataType[] | ReturnStatus> {
  try {
    // const currencyInDB = await prisma.counter
    //   .findMany({
    //     distinct: ["currency"],
    //     select: {
    //       currency: true,
    //     },
    //   })
    //   .then((results) => results.map((r) => r.currency));

    // console.log(currencyInDB);
    const positions = await prisma.position.findMany({
      orderBy: {
        updatedAt: "asc",
      },
      where: {
        status: "closed",
        updatedAt: {
          gte: new Date(`1 Jan ${year}`).toISOString(),
          lte: new Date(`31 Dec ${year}`).toISOString(),
        },
      },
      select: {
        counter: {
          select: {
            currency: true,
          },
        },
        realizedGL: true,
        totalCost: true,
        updatedAt: true,
      },
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const data = months.reduce<
      Record<
        string,
        {
          month: string;
          currency: string;
          type: string;
          value: number;
        }[]
      >
    >((acc, month) => {
      acc[month] = [
        {
          month,
          currency,
          type: "Total Revenue",
          value: 0,
        },
        {
          month,
          currency,
          type: "Total Cost",
          value: 0,
        },
      ];
      return acc;
    }, {});

    // console.log(data);

    positions.forEach((position) => {
      const month = dayjs(position.updatedAt).format("MMM");
      // convert all other currency to rm by default
      // tdl get currency converter api
      let currentPosition =
        position.counter.currency === currency
          ? position
          : convertDataCurrency(currency, position);

      // update totalrevenue
      const totalRevenueObj = data[month][0];
      totalRevenueObj.value = new Prisma.Decimal(totalRevenueObj.value ?? 0)
        .plus(currentPosition.realizedGL)
        .plus(currentPosition.totalCost)
        //cant pass decimal directly to client component,
        // have to convert to number or parse it first

        .toNumber();

      // update total cost
      const totalCostObj = data[month][1];
      totalCostObj.value = new Prisma.Decimal(totalCostObj.value ?? 0)
        .plus(currentPosition.totalCost)
        //cant pass decimal directly to client component,
        // have to convert to number or parse it first
        .toNumber();
    });

    // console.log(Object.values(parseAndStringify(data)).flat());

    return Object.values(data).flat() as YearlyPerformanceDataType[];
    // return data;
  } catch (error) {
    consoleError(error);
    return {
      status: "error",
      message: "Failed to fetch yearly performance.",
    };
  }
}

export type WinRateDetailsDataType = {
  type: string;
  value: number;
};

export type WinRateType = [number, WinRateDetailsDataType[]];

export default async function fetchWinRate(): Promise<
  WinRateType | ReturnStatus
> {
  try {
    const positions = await prisma.position.findMany({
      where: {
        status: "closed",
      },
    });

    const formattedPositions = positions.reduce(
      (acc, el) => {
        if (el.realizedGL.isPositive()) {
          acc.win.value++;
        } else if (el.realizedGL.isNegative()) {
          acc.lost.value++;
        } else if (el.realizedGL.isZero()) {
          acc.even.value++;
        }

        return acc;
      },
      {
        win: { type: "Win", value: 0 },
        lost: { type: "Lost", value: 0 },
        even: { type: "Even", value: 0 },
      }
    );

    return [positions.length, Object.values(formattedPositions)];
    // console.log(formattedPositions);
  } catch (error) {
    consoleError(error);
    return {
      status: "error",
      message: "Failed to fetch win rate.",
    };
  }
}
