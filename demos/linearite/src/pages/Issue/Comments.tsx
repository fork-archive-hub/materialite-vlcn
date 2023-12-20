import { useCallback, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Editor from '../../components/editor/Editor'
import Avatar from '../../components/Avatar'
import { formatDate } from '../../utils/date'
import { showWarning } from '../../utils/notification'
import { Comment, Issue } from '../../domain/SchemaType'
import { DBName, newID } from '../../domain/Schema'
import { useDB, useQuery2 } from '@vlcn.io/react'
import { queries } from '../../domain/queries'
import { mutations } from '../../domain/mutations'

export interface CommentsProps {
  issue: Issue
}

function Comments({ issue }: CommentsProps) {
  const [newCommentBody, setNewCommentBody] = useState<string>('')
  const ctx = useDB(DBName)
  const comments = useQuery2(ctx, queries.issueComments, [issue.id]).data

  const commentList = () => {
    if (comments && comments.length > 0) {
      return comments.map((comment) => (
        <div key={comment.id} className="flex flex-col w-full p-3 mb-3 bg-white rounded shadow-sm border">
          <div className="flex items-center mb-2">
            <Avatar name={comment.creator} />
            <span className="ms-2 text-sm text-gray-400">{comment.creator}</span>
            <span className=" ms-auto text-sm text-gray-400 ml-2">{formatDate(new Date(comment.created))}</span>
          </div>
          <div className="mt-2 text-md prose w-full max-w-full">
            <ReactMarkdown>{comment.body}</ReactMarkdown>
          </div>
        </div>
      ))
    }
  }

  const handlePost = async () => {
    if (!newCommentBody) {
      showWarning('Please enter a comment before submitting', 'Comment required')
      return
    }

    const comment: Comment = {
      id: newID<Comment>(),
      body: newCommentBody,
      issueId: issue.id,
      created: Date.now(),
      creator: 'testuser',
    }
    await mutations.createComment(ctx.db, comment)
    setNewCommentBody('')
  }

  return (
    <>
      {commentList()}
      <Editor
        className="prose w-full max-w-full mt-2 font-normal appearance-none min-h-12 p-3 text-md shadow-sm rounded border border-gray-200 editor"
        value={newCommentBody}
        onChange={(val) => setNewCommentBody(val)}
        placeholder="Add a comment..."
      />
      <div className="flex w-full py-3">
        <button className="px-3 ml-auto text-white bg-indigo-600 rounded hover:bg-indigo-700 h-7" onClick={handlePost}>
          Post Comment
        </button>
      </div>
    </>
  )
}

export default Comments
