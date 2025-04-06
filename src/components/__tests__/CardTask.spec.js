import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import CardTask from '../CardTask.vue'

describe('CardTask.vue', () => {
    const mockTask = {
        label: 'Learn Vitest',
        priority: 'High',
        dueDate: '2025-07-04T14:00',
        done: false,
    }

    const mockMarkAsDone = vi.fn()
    const mockDeleteTask = vi.fn()

    const factory = (task = mockTask) =>
        mount(CardTask, {
            props: {
                task,
                markAsDone: mockMarkAsDone,
                deleteTask: mockDeleteTask,
            },
        })

    it('renders task label and priority correctly', () => {
        const wrapper = factory()
        expect(wrapper.text()).toContain('Learn Vitest')
        expect(wrapper.text()).toContain('High')
    })

    it('renders task title, priority, and formatted due date', () => {
        const wrapper = mount(CardTask, {
            props: { task: mockTask }

        })

        const expectedDate = '07/04/2025 - 02:00 PM'
        expect(wrapper.text()).toContain(mockTask.label)
        expect(wrapper.text()).toContain(mockTask.priority)
        expect(wrapper.text()).toContain(expectedDate)
    })


    it('has edit icon and emits "editTask" when clicked', async () => {
        const wrapper = factory()
        await wrapper.find('.editIcon').trigger('click')
        expect(wrapper.emitted('editTask')).toBeTruthy()
        expect(wrapper.emitted('editTask')[0][0]).toEqual(mockTask)
    })

    it('emits "editTask" when card is clicked', async () => {
        const wrapper = factory()
        await wrapper.trigger('click')
        expect(wrapper.emitted('editTask')).toBeTruthy()
    })

    it('calls markAsDone when done button is clicked', async () => {
        const wrapper = factory()
        const doneButton = wrapper.get('[data-testid="done-button"]')
        await doneButton.trigger('click')
        expect(mockMarkAsDone).toHaveBeenCalledWith(mockTask)
    })

    it('calls deleteTask when delete button is clicked', async () => {
        const wrapper = factory()
        const deleteButton = wrapper.get('[data-testid="delete-button"]')
        await deleteButton.trigger('click')

        expect(mockDeleteTask).toHaveBeenCalled()
    })

    it('renders "Undo" button if task is already done', () => {
        const doneTask = { ...mockTask, done: true }
        const wrapper = factory(doneTask)
        expect(wrapper.text()).toContain('Undo')
    })

    it('renders priority color class correctly', () => {
        const wrapper = factory()
        const priorityBadge = wrapper.find('span.text-xs')
        expect(priorityBadge.classes()).toContain('bg-red-500') // assuming 'High' = red
    })
})
