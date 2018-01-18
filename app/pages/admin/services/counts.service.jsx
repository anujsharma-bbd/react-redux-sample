import { CommonService } from "../../shared/services/common.service";
import { Constants } from "../../../common/app-settings/constants";
import { Utility } from "../../../common/utility/";
import { countStatuses } from "../state/counts"
import moment from 'moment';
/**
 * Counts Service
 */
export const CountService = {

    /**
     * Creates the graphql query.
     * Fetch all counts instances details.
     * Maps the service response to the spec.
     */
    fetchAllCountInstance: () => {
        let queryVariables = `
        {
            "contextAssignmentIds": [],
            "types": 
            [
                { "name": "countInstance", "properties": ["startDate","startTime","endDate","endTime","registrationStartDate", "registrationStartTime", "registrationEndDate", "registrationEndTime" ,"status", "siteDescriptor", "routeDescriptor","updatedAt"] },
                { "name":"countType", "properties":[]}
            ]
        }
        `;

        let outSpec = {
            countInstance: {
                countType: {
                }
            },
            countType: {

            }
        };

        return CommonService.sendRequest(queryVariables, Constants.queryTypes.select).then(response => {
            return Utility.createMappedData(response.data, outSpec);
        }).catch(error => {
            throw new Error(error);
        });
    },
    deactivateCountInstance: (countInstanceToBeDeactivated) => {

        let deactivateCountInstanceMutation, requestPayload;
        deactivateCountInstanceMutation = `
                    deactivate: updateAssignment(
                        assignmentId:${countInstanceToBeDeactivated.id}, 
                        update:{
                            name: "${countInstanceToBeDeactivated.name}",
                            properties:[
                                {type: "status", newValue: "${Constants.countStatus.inactive.value}", newTypeLabel:"${Constants.countStatus.inactive.label}"},
                                {type: "updatedAt", newValue: "${Date.now()}", newTypeLabel:"${Date.now()}"}
                                ]
                        })
                        {
                        id
                        properties
                        }

                    `;


        requestPayload = `mutation DeactivateCountInstance{   
                                    ${deactivateCountInstanceMutation} 
                                    } `;

        return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);
    },
    /**
     * Creates the graphql query.
     * Activate the counts instance and deactivates other Dedmo Instance..
     * Maps the service response to the spec.
     */
    activateCountInstance: (countInstanceToBeActivated, allCountInstances) => {
        let deactivateCountInstanceMutation = "";
        allCountInstances.forEach((countInstanceToBeDeactivated, index) => {
            if (countInstanceToBeActivated.id != countInstanceToBeDeactivated.id) {
                if (countInstanceToBeDeactivated.type) {
                    deactivateCountInstanceMutation += `
                    deactivate${index + 1}: updateAssignment(
                        assignmentId:${countInstanceToBeDeactivated.id}, 
                        update:{
                            name: "${countInstanceToBeDeactivated.name}",
                            properties:[
                                {type: "status", newValue: "${Constants.countStatus.inactive.value}", newTypeLabel:"${Constants.countStatus.inactive.label}"},
                                {type: "siteDescriptor", newValue: "${countInstanceToBeDeactivated.siteDescriptor}", newTypeLabel:"${countInstanceToBeDeactivated.siteDescriptor}"},
                                {type: "routeDescriptor", newValue: "${countInstanceToBeDeactivated.routeDescriptor}", newTypeLabel:"${countInstanceToBeDeactivated.routeDescriptor}"}
                                ]
                        })
                        {
                        id
                        properties
                        }
                    createRealtionWithType${index + 1}: createAssignmentRelation(parentAssignmentId: ${countInstanceToBeDeactivated.type.id} , childAssignmentId:${countInstanceToBeDeactivated.id}){
                    assignment1Id
                    assignment2Id
                    id
                    }

                    `;
                } else {
                    deactivateCountInstanceMutation += `
                    deactivate${index + 1}: updateAssignment(
                        assignmentId:${countInstanceToBeDeactivated.id}, 
                        update:{
                            name: "${countInstanceToBeDeactivated.name}",
                            properties:[
                                {type: "status", newValue: "${Constants.countStatus.inactive.value}", newTypeLabel:"${Constants.countStatus.inactive.label}"},
                                {type: "siteDescriptor", newValue: "${countInstanceToBeDeactivated.siteDescriptor}", newTypeLabel:"${countInstanceToBeDeactivated.siteDescriptor}"},
                                {type: "routeDescriptor", newValue: "${countInstanceToBeDeactivated.routeDescriptor}", newTypeLabel:"${countInstanceToBeDeactivated.routeDescriptor}"}
                                ]
                        })
                        {
                        id
                        properties
                        }

                    `;

                }
            }
        });
        let activateCountInstanceMutation = null;
        let createCountTypeRelationMutation = null;
        if (countInstanceToBeActivated.type) {
            activateCountInstanceMutation = `
            activate: updateAssignment(
                                      assignmentId:${countInstanceToBeActivated.id},
                                      update: { name: "${countInstanceToBeActivated.name}",
                                      properties: [
                                            {type: "status", newValue: "${Constants.countStatus.active.value}", newTypeLabel:"${Constants.countStatus.active.label}"},
                                            {type: "siteDescriptor", newValue: "${countInstanceToBeActivated.siteDescriptor}", newTypeLabel:"${countInstanceToBeActivated.siteDescriptor}"},
                                            {type: "routeDescriptor", newValue: "${countInstanceToBeActivated.routeDescriptor}", newTypeLabel:"${countInstanceToBeActivated.routeDescriptor}"},
                                            {type: "updatedAt", newValue: "${Date.now()}", newTypeLabel:"${Date.now()}"}
                                    ]})
                                      {
                                          id
                                          properties
                                        }
            createRealtionWithType: createAssignmentRelation(parentAssignmentId: ${countInstanceToBeActivated.type.id} , childAssignmentId:${countInstanceToBeActivated.id}){
                assignment1Id
                assignment2Id
                id
                }
        `;
        } else {
            activateCountInstanceMutation = `
            activate: updateAssignment(
                                      assignmentId:${countInstanceToBeActivated.id},
                                      update: { name: "${countInstanceToBeActivated.name}",
                                      properties: [
                                            {type: "status", newValue: "${Constants.countStatus.active.value}", newTypeLabel:"${Constants.countStatus.active.label}"},
                                            {type: "siteDescriptor", newValue: "${countInstanceToBeActivated.siteDescriptor}", newTypeLabel:"${countInstanceToBeActivated.siteDescriptor}"},
                                            {type: "routeDescriptor", newValue: "${countInstanceToBeActivated.routeDescriptor}", newTypeLabel:"${countInstanceToBeActivated.routeDescriptor}"},
                                            {type: "updatedAt", newValue: "${Date.now()}", newTypeLabel:"${Date.now()}"}
                                    ]})
                                      {
                                          id
                                          properties
                                        }            
        `;
        }

        let requestPayload = null;
        requestPayload = `mutation ActivateCountInstance{   
                                    ${deactivateCountInstanceMutation} 
                                    ${activateCountInstanceMutation}
                                    } `;

        return CommonService.sendRequest(null, Constants.queryTypes.mutation, requestPayload);
    },

    /**
     * Creates the graphql query.
     * Creates new Dedmo Instance.
     * Maps the service response to the spec.
     */
    createNewCountInstance: (newCountInstance, siteDescriptor, routeDescriptor) => {
        let mutation = `
          mutation CreateNewCountInstance {
            createAssignment(assignment:
              {
                name: "${newCountInstance.name}",
                label: "${newCountInstance.name}",
                type: "countInstance",
                countType: "${newCountInstance.type.name}",
                properties: [
                  {type: "startDate", value: "${moment(newCountInstance.startDate)}", typeLabel:"${moment(newCountInstance.startDate)}"},
                  {type: "startTime", value: "${moment(newCountInstance.startTime)}", typeLabel:"${moment(newCountInstance.startTime)}"},
                  {type: "endDate", value: "${moment(newCountInstance.endDate)}", typeLabel:"${moment(newCountInstance.endDate)}"},
                  {type: "endTime", value: "${moment(newCountInstance.endTime)}", typeLabel:"${moment(newCountInstance.endTime)}"},
                  {type: "registrationStartDate", value: "${moment(newCountInstance.registrationStartDate)}", typeLabel:"${moment(newCountInstance.registrationStartDate)}"},
                  {type: "registrationStartTime", value: "${moment(newCountInstance.registrationStartTime)}", typeLabel:"${moment(newCountInstance.registrationStartTime)}"},
                  {type: "registrationEndDate", value: "${moment(newCountInstance.registrationEndDate)}", typeLabel:"${moment(newCountInstance.registrationEndDate)}"},
                  {type: "registrationEndTime", value: "${moment(newCountInstance.registrationEndTime)}", typeLabel:"${moment(newCountInstance.registrationEndTime)}"},
                  {type: "status", value: "${Constants.countStatus.inactive.value}", typeLabel:"${Constants.countStatus.inactive.label}"},
                  {type: "siteDescriptor", value: "${newCountInstance.siteDescriptor}", typeLabel:"${newCountInstance.siteDescriptor}"},
                  {type: "routeDescriptor", value: "${newCountInstance.routeDescriptor}", typeLabel:"${newCountInstance.routeDescriptor}"},
                  {type: "updatedAt", value: "${Date.now()}", typeLabel:"${Date.now()}"}
                ]
              },contextAssignmentIds:[${newCountInstance.type.id}]
            )
            {
              id
            }            
        }`;
        return CommonService.sendGraphQLWithTeamAndRouteFormData(null, Constants.queryTypes.mutation, mutation, routeDescriptor, siteDescriptor);
    },

    createNewCountAndTypeRelation: (newCountInstanceId, countTypeId) => {
        let mutation = `
            mutation CreateRelationNewCountAndType {
                createAssignmentRelation(parentAssignmentId: ${countTypeId} , childAssignmentId:${newCountInstanceId}){
                    assignment1Id
                    assignment2Id
                    id
                }
            }
        `;

        return CommonService.sendRequest(null, Constants.queryTypes.mutation, mutation);
    },


    /**
     * Creates the graphql query.
     * Updates Dedmo Instance.
     * Maps the service response to the spec.
     */
    updateCountInstance: (countInstanceToUpdate, siteDescriptor, routeDescriptor) => {
        let mutation = null;
        let destroyCurrentCountTypeRelationMutation = null;
        if (countInstanceToUpdate.currentType) {
            destroyCurrentCountTypeRelationMutation = `destroyAssignmentRelation(parentAssignmentId:${countInstanceToUpdate.currentType.id}, childAssignmentId: ${countInstanceToUpdate.id})`;

            mutation = `
            mutation UpdateCountInstance {
            updateAssignment(assignmentId: ${countInstanceToUpdate.id},
                update: {
                    name: "${countInstanceToUpdate.name}",
                    label: "${countInstanceToUpdate.name}",
                    properties: [
                    {type: "startDate", newValue: "${countInstanceToUpdate.startDate}", newTypeLabel:"${countInstanceToUpdate.startDate}"},
                    {type: "startTime", newValue: "${countInstanceToUpdate.startTime}", newTypeLabel:"${countInstanceToUpdate.startTime}"},
                    {type: "endDate", newValue: "${countInstanceToUpdate.endDate}", newTypeLabel:"${countInstanceToUpdate.endDate}"},
                    {type: "endTime", newValue: "${countInstanceToUpdate.endTime}", newTypeLabel:"${countInstanceToUpdate.endTime}"},
                    {type: "registrationStartDate", newValue: "${countInstanceToUpdate.registrationStartDate}", newTypeLabel:"${countInstanceToUpdate.registrationStartDate}"},
                    {type: "registrationStartTime", newValue: "${countInstanceToUpdate.registrationStartTime}", newTypeLabel:"${countInstanceToUpdate.registrationStartTime}"},
                    {type: "registrationEndDate", newValue: "${countInstanceToUpdate.registrationEndDate}", newTypeLabel:"${countInstanceToUpdate.registrationEndDate}"},
                    {type: "registrationEndTime", newValue: "${countInstanceToUpdate.registrationEndTime}", newTypeLabel:"${countInstanceToUpdate.registrationEndTime}"},                    
                    {type: "siteDescriptor", newValue: "${countInstanceToUpdate.siteDescriptor}", newTypeLabel:"${countInstanceToUpdate.siteDescriptor}"},
                    {type: "routeDescriptor", newValue: "${countInstanceToUpdate.routeDescriptor}", newTypeLabel:"${countInstanceToUpdate.routeDescriptor}"},
                    {type: "updatedAt", newValue: "${Date.now()}", newTypeLabel:"${Date.now()}"}
                    ]
                }
                )
                {
                id
                }
                ${destroyCurrentCountTypeRelationMutation} 
                createAssignmentRelation(parentAssignmentId: ${countInstanceToUpdate.newType.id} , childAssignmentId:${countInstanceToUpdate.id}){
                    assignment1Id
                    assignment2Id
                    id
                    }
        }`;
        } else {
            mutation = `
            mutation UpdateCountInstance {
            updateAssignment(assignmentId: ${countInstanceToUpdate.id},
                update: {
                    name: "${countInstanceToUpdate.name}",
                    label: "${countInstanceToUpdate.name}",
                    properties: [
                    {type: "startDate", newValue: "${countInstanceToUpdate.startDate}", newTypeLabel:"${countInstanceToUpdate.startDate}"},
                    {type: "startTime", newValue: "${countInstanceToUpdate.startTime}", newTypeLabel:"${countInstanceToUpdate.startTime}"},
                    {type: "endDate", newValue: "${countInstanceToUpdate.endDate}", newTypeLabel:"${countInstanceToUpdate.endDate}"},
                    {type: "endTime", newValue: "${countInstanceToUpdate.endTime}", newTypeLabel:"${countInstanceToUpdate.endTime}"},
                    {type: "registrationStartDate", newValue: "${countInstanceToUpdate.registrationStartDate}", newTypeLabel:"${countInstanceToUpdate.registrationStartDate}"},
                    {type: "registrationStartTime", newValue: "${countInstanceToUpdate.registrationStartTime}", newTypeLabel:"${countInstanceToUpdate.registrationStartTime}"},
                    {type: "registrationEndDate", newValue: "${countInstanceToUpdate.registrationEndDate}", newTypeLabel:"${countInstanceToUpdate.registrationEndDate}"},
                    {type: "registrationEndTime", newValue: "${countInstanceToUpdate.registrationEndTime}", newTypeLabel:"${countInstanceToUpdate.registrationEndTime}"},
                    {type: "siteDescriptor", newValue: "${countInstanceToUpdate.siteDescriptor}", newTypeLabel:"${countInstanceToUpdate.siteDescriptor}"},
                    {type: "routeDescriptor", newValue: "${countInstanceToUpdate.routeDescriptor}", newTypeLabel:"${countInstanceToUpdate.routeDescriptor}"},
                    {type: "updatedAt", newValue: "${Date.now()}", newTypeLabel:"${Date.now()}"}
                    ]
                }
                )
                {
                id
                }
                createAssignmentRelation(parentAssignmentId: ${countInstanceToUpdate.newType.id} , childAssignmentId:${countInstanceToUpdate.id}){
                    assignment1Id
                    assignment2Id
                    id
                    }
            }`;
        }

        return CommonService.sendGraphQLWithTeamAndRouteFormData(null, Constants.queryTypes.mutation, mutation, routeDescriptor, siteDescriptor);
    },

    deleteCountInstance: (countInstanceTobeDeleted) => {
        let mutation = null;
        if (countInstanceTobeDeleted.type) {
            mutation = `
            mutation DeleteCountInstance{
                destroyAssignmentRelation(parentAssignmentId:${countInstanceTobeDeleted.type.id}, childAssignmentId: ${countInstanceTobeDeleted.id})
                destroyAssignment(id: ${countInstanceTobeDeleted.id})
            }
        `;
        } else {
            mutation = `
            mutation DeleteCountInstance{
                destroyAssignment(id: ${countInstanceTobeDeleted.id})
            }
        `;
        }

        return CommonService.sendRequest(null, Constants.queryTypes.mutation, mutation)
    },

    getActiveCountInstance: function (activeQCInstance) {
        let variables = `{
                        "contextAssignmentIds": [],
                        "types": [
                                  {"name":"countInstance", "properties":["startDate","startTime","endDate","endTime","registrationStartDate", "registrationStartTime","registrationEndDate", "registrationEndTime", "status", "siteDescriptor", "routeDescriptor","updatedAt"]},
                                  { "name":"countType", "properties":[]}
                                ]
                      }`;
        let specs = {
            countInstance: {
                countType: {
                }
            }
        };
        return CommonService.sendRequest(variables, Constants.queryTypes.select).then(response => {
            const x = Utility.createMappedData(response.data, specs);
            return x
        }).catch(error => {
            throw new Error(error);
        });

    },
};

