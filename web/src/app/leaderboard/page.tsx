'use client';
import Error from '@/components/common/Error';
import Loading from '@/components/common/Loading';
import Navbar from '@/components/Navbar/Navbar';
import React from 'react';
import useSWR from 'swr';

type Person = {
  id: string;
  score: number;
  goose: string;
  _count: { initiatedBattles: number; invitedToBattles: number };
};

const LeaderboardPage = ({ initialData }: { initialData: Person[] }) => {
  const { data, error, isLoading } = useSWR(
    '/api/players',
    (...args) => fetch(...args).then(res => res.json()),
    { fallbackData: initialData }
  );

  if (error) return <Error message="Failed to load leaderboard" />;
  if (!data && isLoading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="px-4 sm:px-6 lg:px-8 p-6 max-w-full overflow-x-scroll">
        <h1 className="text-3xl mt-4 font-bold leading-6 text-center w-full">
          Leaderboard
        </h1>
        <div className="mx-auto mt-4 flex justify-center max-w-full overflow-x-scroll">
          <div className="inline-block py-2 align-middle max-w-full overflow-x-scroll">
            <div className="overflow-x-scroll overflow-y-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg dark:bg-gray-700 ">
              <table className="sm:px-6 lg:px-8 mx-auto overflow-x-scroll">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      align="center"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 dark:text-gray-100"
                    >
                      ID
                    </th>
                    <th
                      className="px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-100"
                      align="center"
                    >
                      Total Score
                    </th>
                    <th
                      className="px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-100"
                      align="center"
                    >
                      Games Played
                    </th>
                    <th
                      className="px-3 py-3.5 text-sm font-semibold text-gray-900 dark:text-gray-100"
                      align="center"
                    >
                      Win Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-800 dark:divide-gray-600">
                  {data &&
                    data
                      .filter((x: Person) => x.id)
                      .map((person: Person) => (
                        <tr key={person.id}>
                          <td
                            className="whitespace-nowrap py-4 pl-4 flex pr-3 text-sm font-medium items-center justify-start text-gray-900 sm:pl-6 dark:text-gray-100"
                            style={{ gap: '16px' }}
                          >
                            {person.id}
                          </td>
                          <td
                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300"
                            align="center"
                          >
                            {person.score}
                          </td>
                          <td
                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300"
                            align="center"
                          >
                            {person._count.initiatedBattles +
                              person._count.invitedToBattles}
                          </td>
                          <td
                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300"
                            align="center"
                          >
                            {person.score /
                              (person._count.initiatedBattles +
                                person._count.invitedToBattles)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
          svg {
            height: 50px;
          }`}
      </style>
    </>
  );
};

export default LeaderboardPage;
