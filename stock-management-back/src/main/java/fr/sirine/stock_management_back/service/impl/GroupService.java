package fr.sirine.stock_management_back.service.impl;

import fr.sirine.stock_management_back.entities.Group;
import fr.sirine.stock_management_back.exceptions.custom.GroupAlreadyExistException;
import fr.sirine.stock_management_back.exceptions.custom.GroupNotFountException;
import fr.sirine.stock_management_back.repository.GroupRepository;
import fr.sirine.stock_management_back.service.IGroupService;
import org.springframework.stereotype.Service;

@Service
public class GroupService implements IGroupService {
    private final GroupRepository groupRepository;

    public GroupService(GroupRepository groupRepository) {
        this.groupRepository = groupRepository;
    }
    public Group findById(Integer id) {
        return groupRepository.findById(id).orElseThrow(() -> new GroupNotFountException("Group not found"));
    }
    public void updateGroup(Integer id, String groupName) {
        Group group = findById(id);
        if (groupRepository.findByName(groupName).isPresent()) {
            throw new GroupAlreadyExistException("nom de groupe déjà utilisé");
        } else {
            group.setName(groupName);
            groupRepository.save(group);
        }
    }
    public void deleteGroup(Integer id) {
        Group group = groupRepository.findById(id).orElseThrow(() -> new GroupNotFountException("Group not found"));
        groupRepository.delete(group);
    }
}
