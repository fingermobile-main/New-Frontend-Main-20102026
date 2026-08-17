import React, { useState } from 'react';


import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from "../contexts/AppContext";

import type { LendsqrProject as LendsqrProjectType } from '../types';

type LendsqrProject = any;
import { LendsqrIcon, UserCircleIcon, GiftIcon, LinkIcon, HeartIcon, ArrowUpIcon, ArrowDownIcon, CreditCardIcon } from '../icons';
import AnimatedAvatar from '../components/AnimatedAvatar';
import PageHeader from '../components/PageHeader';

const LendsqrPage: React.FC = () => {
  const { lendsqrProjects = [], ficBalance = 0, showToast } = useAppContext();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);

  const onLike = async (projectId: string) => {
    try {
      // In a real app, this would call an API
      showToast("Project liked successfully", "success");
    } catch (error) {
      console.error("Error liking project:", error);
      showToast("Failed to like project", "error");
    }
  };

  const onAddComment = async (projectId: string, comment: string) => {
    try {
      // In a real app, this would call an API
      showToast("Comment added successfully", "success");
    } catch (error) {
      console.error("Error adding comment:", error);
      showToast("Failed to add comment", "error");
    }
  };

  const onOpenGiftModal = (projectId: string) => {
    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = (projectId: string) => {
    setShowPaylinkModal(true);
  };

  const onVote = async (projectId: string, voteType: "up" | "down") => {
    try {
      // In a real app, this would call an API
      showToast("Vote recorded successfully", "success");
    } catch (error) {
      console.error("Error voting on project:", error);
      showToast("Failed to record vote", "error");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      // In a real app, this would call an API
      showToast("Project deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting project:", error);
      showToast("Failed to delete project", "error");
    }
  };

  const handleTokenizeProject = async (projectId: string) => {
    try {
      // In a real app, this would call an API
      showToast("Project tokenized successfully", "success");
    } catch (error) {
      console.error("Error tokenizing project:", error);
      showToast("Failed to tokenize project", "error");
    }
  };

  const handleAiAssist = async (projectId: string) => {
    try {
      // In a real app, this would call an API
      showToast("AI assistance applied successfully", "success");
    } catch (error) {
      console.error("Error applying AI assistance:", error);
      showToast("Failed to apply AI assistance", "error");
    }
  };

  const ProjectCard: React.FC<{ project: LendsqrProject }> = ({ project }) => {
    const progress = (project.current / project.goal) * 100;

    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group flex flex-col border border-gray-100">
        <div className="relative">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-48 object-cover"
           />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={() => onLike(project.id)}
              className="p-2.5 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <HeartIcon className="w-4 h-4 text-red-500" />
            </button>
            <button
              onClick={() => onOpenGiftModal(project.id)}
              className="p-2.5 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <GiftIcon className="w-4 h-4 text-blue-500" />
            </button>
            <button
              onClick={() => onOpenPaylinkModal(project.id)}
              className="p-2.5 bg-white rounded-full shadow hover:bg-gray-100"
            >
              <LinkIcon className="w-4 h-4 text-green-500" />
            </button>
          </div>
        </div>
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="font-bold text-lg text-gray-900 truncate">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 my-2">
            <AnimatedAvatar
              staticUrl={project.creator.avatarUrl}
              altText={project.creator.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm text-gray-600">
              by {project.creator.name}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-4 flex-grow">
            {project.description}
          </p>

          <div className="mb-4">
            <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
              <span>{project.current.toLocaleString()} FIC</span>
              <span>{project.goal.toLocaleString()} FIC</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {project.backers} backers
            </p>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700">
              Fund Project
            </button>
            <button
              onClick={() => onVote(project.id, "up")}
              className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <ArrowUpIcon className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={() => onVote(project.id, "down")}
              className="p-2.5 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              <ArrowDownIcon className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <CreditCardIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Lendsqr Crowdfunding
              </h1>
              <p className="text-gray-600">
                Support and crowdfund projects from creators in the community
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-gray-900">FIC Balance: {ficBalance}</span>
              <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700">
                Create Project
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lendsqrProjects.map((project: any) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-blue-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Crowdfunding Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  <GiftIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Support Project
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  <LinkIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Create Paylink
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Fund Project
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Crowdfunding Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Research projects before funding</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Diversify your investments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Track project progress</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LendsqrPage;