"use client";

import Link from "next/link";
import Container from "@/components/Container";
import { Inter } from 'next/font/google';
import { useState, useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function UserContentPage() {
  // State for storing user content
  const [userContent, setUserContent] = useState<{
    files: Array<{ name: string; content: string }>;
    url: { address: string; content: string };
    text: string;
  }>({
    files: [],
    url: { address: '', content: '' },
    text: ''
  });

  // Load user content from localStorage on component mount
  useEffect(() => {
    const loadUserContent = () => {
      try {
        // Load file contents
        const fileContents = localStorage.getItem('fileContents');
        console.log('File contents from localStorage:', fileContents);
        const files = fileContents ? JSON.parse(fileContents) : [];
        console.log('Parsed files:', files);
        
        // Load URL content
        const urlInput = localStorage.getItem('urlInput') || '';
        const urlContent = localStorage.getItem('urlContent') || '';
        console.log('URL input:', urlInput);
        console.log('URL content:', urlContent);
        
        // Load text input
        const textInput = localStorage.getItem('textInput') || '';
        console.log('Text input:', textInput);
        
        const content = {
          files: files.map((content: string, index: number) => {
            // Extract file name and content from the stored format
            const lines = content.split('\n');
            const fileName = lines[0].replace('File: ', '');
            const fileContent = lines.slice(2).join('\n'); // Skip "File: name" and empty line
            
            return {
              name: fileName,
              content: fileContent
            };
          }),
          url: { address: urlInput, content: urlContent },
          text: textInput
        };
        
        console.log('Setting user content:', content);
        setUserContent(content);
      } catch (error) {
        console.error('Error loading user content:', error);
      }
    };

    loadUserContent();
  }, []);

  // Check if there's any content to display
  const hasContent = userContent.files.length > 0 || userContent.url.address || userContent.text;

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <Container>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl font-bold text-gray-900 ${inter.className}`}>
                  User Content
                </h1>
                <p className={`text-gray-600 mt-2 ${inter.className}`}>
                  Raw data uploaded by the user
                </p>
              </div>
              <Link 
                href="/feed"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Feed</span>
              </Link>
            </div>
          </div>

          {/* Main Content - Full Width */}
          <div className="w-full">
            <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
              <h2 className={`text-2xl font-bold text-gray-900 mb-8 ${inter.className}`}>
                Raw User Uploaded Data
              </h2>
              
              {/* Debug Information */}
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className={`text-lg font-semibold text-yellow-900 mb-2 ${inter.className}`}>
                  🔍 Debug Information
                </h3>
                <div className="text-sm text-yellow-800 space-y-1">
                  <div>Files count: {userContent.files.length}</div>
                  <div>URL address: "{userContent.url.address}"</div>
                  <div>URL content: "{userContent.url.content}"</div>
                  <div>Text input: "{userContent.text}"</div>
                  <div>Has content: {hasContent ? 'true' : 'false'}</div>
                </div>
              </div>
              
              {hasContent ? (
                <div className="space-y-8">
                  {/* Files Section */}
                  {userContent.files.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className={`text-xl font-bold text-blue-900 mb-4 ${inter.className}`}>
                        📁 Uploaded Files ({userContent.files.length})
                      </h3>
                      <div className="space-y-4">
                        {userContent.files.map((file, index) => (
                          <div key={index} className="bg-white border border-blue-200 rounded-lg p-4">
                            <h4 className={`text-lg font-semibold text-blue-800 mb-3 ${inter.className}`}>
                              {file.name}
                            </h4>
                            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto">
                              <pre className={`text-sm text-gray-700 whitespace-pre-wrap font-mono ${inter.className}`}>
                                {file.content}
                              </pre>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* URL Section */}
                  {userContent.url.address && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className={`text-xl font-bold text-green-900 mb-4 ${inter.className}`}>
                        🔗 URL Content
                      </h3>
                      <div className="bg-white border border-green-200 rounded-lg p-4">
                        <div className="mb-4">
                          <h4 className={`text-lg font-semibold text-green-800 mb-2 ${inter.className}`}>
                            URL Address
                          </h4>
                          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                            <span className={`text-sm text-blue-600 font-mono ${inter.className}`}>
                              {userContent.url.address}
                            </span>
                          </div>
                        </div>
                        <div>
                          <h4 className={`text-lg font-semibold text-green-800 mb-2 ${inter.className}`}>
                            Extracted Content
                          </h4>
                          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto">
                            <pre className={`text-sm text-gray-700 whitespace-pre-wrap font-mono ${inter.className}`}>
                              {userContent.url.content || "Content from URL would be displayed here..."}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Text Input Section */}
                  {userContent.text && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                      <h3 className={`text-xl font-bold text-purple-900 mb-4 ${inter.className}`}>
                        📝 Text Input
                      </h3>
                      <div className="bg-white border border-purple-200 rounded-lg p-4">
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto">
                          <pre className={`text-sm text-gray-700 whitespace-pre-wrap font-mono ${inter.className}`}>
                            {userContent.text}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* No Content Message */
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${inter.className}`}>
                    No User Content Available
                  </h3>
                  <p className={`text-gray-600 mb-6 ${inter.className}`}>
                    Upload files, add URLs, or enter text on the data feed page to see content here.
                  </p>
                  <Link 
                    href="/feed"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Go to Data Feed
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
