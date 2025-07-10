package fr.sirine.stock_management_back.service;

import fr.sirine.stock_management_back.entities.Group;

public interface IGroupService {
     Group findById(Integer id);
     void updateGroup(Integer id, String groupName);
}
